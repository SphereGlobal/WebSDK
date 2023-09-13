import {
  ChargeReqBody,
  ChargeResponse,
  Credentials,
  Environments,
  LoginBehavior,
  Transaction,
  User,
  iWebSDK,
} from './src/types';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from './src/components/LoginButton';

class WebSDK implements iWebSDK {
  static instance: WebSDK | undefined = undefined;

  loginType: LoginBehavior = LoginBehavior.REDIRECT;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  apiKey?: string;
  baseUrl?: string;
  user?: User | null | undefined = undefined;
  credentials?: Credentials | null;
  #environment: Environments = Environments.PRODUCTION;
  #oauth2Client?: UserManager;
  #wrappedDek: string = '';
  #wrappedDekExpiration: number = 0;

  #domainDev: string = 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com/';
  #audienceDev: string = 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com';
  #domainProd: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/';
  #audienceProd: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com';

  // by default, points to "DEVELOPMENT" environment
  #domain: string = this.#domainDev;
  #audience: string = this.#audienceDev;

  #pwaDevUrl = 'http://localhost:19006';
  #pwaStagingUrl = 'https://sphereonewallet.web.app';
  #pwaProdUrl = 'https://wallet.sphereone.xyz';

  setClientId = (clientId: string) => {
    this.clientId = clientId;
    return this;
  };

  setClientSecret = (clientSecret: string) => {
    this.clientSecret = clientSecret;
    return this;
  };

  setRedirectUri = (redirectUri: string) => {
    this.redirectUri = redirectUri;
    return this;
  };

  setApiKey = (apiKey: string) => {
    this.apiKey = apiKey;
    return this;
  };

  setBaseUrl = (baseUrl: string) => {
    // trim and remove trailing slash `/`
    const newBaseUrl = baseUrl.trim();
    this.baseUrl = newBaseUrl.endsWith('/') ? newBaseUrl.slice(0, -1) : newBaseUrl;
    return this;
  };

  setEnvironment = (environment: Environments = Environments.PRODUCTION) => {
    this.#environment = environment;
    if (environment === Environments.DEVELOPMENT || environment === Environments.STAGING) {
      this.#domain = this.#domainDev;
      this.#audience = this.#audienceDev;
    } else {
      this.#domain = this.#domainProd;
      this.#audience = this.#audienceProd;
    }
    return this;
  };

  setLoginType = (loginType: LoginBehavior = LoginBehavior.REDIRECT) => {
    this.loginType = loginType;
    return this;
  };

  build = () => {
    if (typeof window === 'undefined') return;
    if (!this.clientId) throw new Error('Missing clientId');
    if (!this.redirectUri) throw new Error('Missing redirectUri');
    if (!this.apiKey) throw new Error('Missing apiKey');
    if (!this.baseUrl) throw new Error('Missing baseUrl');
    if (WebSDK.instance) return WebSDK.instance;

    this.#oauth2Client = new UserManager({
      authority: this.#domain as string,
      client_id: this.clientId as string,
      client_secret: this.clientSecret as string,
      redirect_uri: this.redirectUri as string,
      response_type: 'code',
      post_logout_redirect_uri: this.redirectUri as string,
      userStore: window ? new WebStorageStateStore({ store: window.localStorage }) : undefined,
      scope: 'openid offline_access',
      automaticSilentRenew: true,
    });

    WebSDK.instance = this;
    return WebSDK.instance as WebSDK;
  };

  clear = () => {
    this.user = null;
    this.credentials = null;
    this.#wrappedDek = '';
  };

  handleAuth = async () => {
    try {
      const authResult: any = await new Promise(async (resolve, reject) => {
        try {
          const user = await this.#oauth2Client?.signinCallback();
          resolve(user);
        } catch (error: any) {
          reject(error);
        }
      });
      if (authResult) {
        this.credentials = {
          accessToken: authResult.access_token,
          idToken: authResult.id_token,
          refreshToken: authResult.refresh_token,
          expires_at: authResult.expires_at,
        };

        if (this.user) {
          this.user.uid = authResult.profile.sub;
        } else this.user = { uid: authResult.profile.sub };
        await this.getUserInfo();
        return authResult;
      } else return null;
    } catch (error: any) {
      console.error('There was an error loggin in, error: ', error);
      return error;
    }
  };

  handlePersistence = async () => {
    const persistence = await this.#oauth2Client?.getUser();
    console.log('persistence', persistence);
    if (persistence) {
      const isExpired = await this.isTokenExpired();
      if (!isExpired) {
        console.log('token not expired');
        this.credentials = {
          accessToken: persistence.access_token,
          idToken: persistence.id_token as string,
          refreshToken: persistence.refresh_token,
          expires_at: persistence.expires_at ?? 0,
        };
        if (this.user) this.user.uid = persistence.profile.sub;
        else this.user = { uid: persistence.profile.sub };
        await this.getUserInfo();
        return persistence;
      } else {
        const refreshed = await this.refreshToken();
        console.log('refreshed inside handle persistence', refreshed);
        if (refreshed) {
          this.credentials = {
            accessToken: refreshed.access_token,
            idToken: refreshed.id_token as string,
            refreshToken: refreshed.refresh_token,
            expires_at: refreshed.expires_at ?? 0,
          };
          if (this.user) this.user.uid = refreshed.profile.sub;
          else this.user = { uid: refreshed.profile.sub };
          await this.getUserInfo();
          return refreshed;
        } else {
          console.log("couldn't refresh token");
          this.logout();
          return null;
        }
      }
    } else return null;
  };

  handleCallback = async () => {
    try {
      console.log('handleCallback');
      const persistence = await this.handlePersistence();
      console.log('persistence inside handleCallback', persistence);
      if (persistence) return persistence;

      console.log('handleAuth');
      const handleAuth = await this.handleAuth();
      console.log('handleAuth inside handleCallback', handleAuth);
      return handleAuth;
    } catch (error) {
      console.error('There was an error logging in , error: ', error);
      return error;
    }
  };

  login = async () => {
    if (this.loginType === LoginBehavior.REDIRECT) {
      await this.#oauth2Client?.signinRedirect({
        extraQueryParams: { audience: this.#audience },
      });
    } else {
      try {
        const authResult = await this.#oauth2Client?.signinPopup({
          extraQueryParams: { audience: this.#audience },
        });

        if (authResult) {
          this.credentials = {
            accessToken: authResult.access_token,
            idToken: authResult.id_token as string,
            refreshToken: authResult.refresh_token,
            expires_at: authResult.expires_at ?? 0,
          };
          if (this.user) this.user.uid = authResult.profile.sub;
          else this.user = { uid: authResult.profile.sub };
          return authResult;
        } else return null;
      } catch (error: any) {
        console.error('There was an error logging in , error: ', error);
        return error;
      }
    }
  };

  logout = () => {
    try {
      if (typeof window === 'undefined') return;
      this.#oauth2Client?.signoutSilent();
      window.location.replace(this.redirectUri as string);
      this.clear();
    } catch (e) {
      console.log('error logging out', e);
    }
  };

  #createRequest = async (method: string = 'GET', body: any = {}, headers: any = {}) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${this.credentials?.accessToken}`);

    if (Object.keys(headers).length) {
      for (const [key, value] of Object.entries(headers)) {
        myHeaders.append(key, value as string);
      }
    }

    let requestOptions: any = {};

    if (method === 'GET') {
      requestOptions = {
        method,
        headers: myHeaders,
      };
    } else {
      const raw = JSON.stringify({
        ...body,
      });

      requestOptions = {
        method,
        headers: myHeaders,
        body: raw,
      };
    }

    return requestOptions;
  };

  #fetchUserBalances = async () => {
    try {
      const requestOptions = await this.#createRequest();

      const response = await fetch(
        `${this.baseUrl}/getFundsAvailable?refreshCache=true`,
        requestOptions
      );

      const data = await response.json();
      if (this.user) this.user.balances = data.data;
      return data.data;
    } catch (error: any) {
      console.error('There was an error fetching user balances, error: ', error);
      return error;
    }
  };

  #fetchUserWallets = async (forceRefresh?: boolean) => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.baseUrl}/user/wallets`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.wallets = data.data;
      return data.data;
    } catch (error: any) {
      console.error('There was an error fetching user wallets, error: ', error);
      return error;
    }
  };

  #fetchUserInfo = async () => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.baseUrl}/user`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.info = data.data;
      return data.data;
    } catch (error: any) {
      console.error('There was an error fetching user info, error: ', error);
      return error;
    }
  };

  #fetchUserNfts = async () => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.baseUrl}/getNftsAvailable`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.nfts = data.data;
      return data.data;
    } catch (error: any) {
      console.error('There was an error fetching user nfts, error: ', error);
      return error;
    }
  };

  #getWrappedDek = async () => {
    if (this.#wrappedDek && this.#wrappedDekExpiration > Date.now()) return this.#wrappedDek;
    try {
      const requestOptions = await this.#createRequest('POST');

      const response = await fetch(`${this.baseUrl}/createOrRecoverAccount`, requestOptions);

      const data = await response.json();
      this.#wrappedDek = data.data;
      this.#wrappedDekExpiration = Date.now() + 1000 * 60 * 30;
      return data.data;
    } catch (error: any) {
      console.error('There was an error getting wrapped dek, error: ', error);
      return error;
    }
  };

  createCharge = async (charge: ChargeReqBody) => {
    try {
      const requestOptions = await this.#createRequest(
        'POST',
        { chargeData: charge },
        { 'x-api-key': this.apiKey ?? '' }
      );

      const response = await fetch(`${this.baseUrl}/createCharge`, requestOptions);

      const data = await response.json();
      return data.data as ChargeResponse;
    } catch (error: any) {
      console.error('There was an error creating your transaction, error: ', error);
      return error;
    }
  };

  pay = async ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => {
    const payFn = async () => {
      const wrappedDek = await this.#getWrappedDek();

      const requestOptions = await this.#createRequest('POST', {
        wrappedDek,
        toAddress,
        chain,
        symbol,
        amount,
        tokenAddress,
      });

      const response = await fetch(`${this.baseUrl}/pay`, requestOptions);
      const data = await response.json();
      return data.data;
    };
    try {
      await this.checkTokenAndExecuteFunction(payFn);
    } catch (error: any) {
      console.error('There was an processing your payment, error: ', error);
      return error;
    }
  };

  payCharge = async (transactionId: string) => {
    const payChargeFn = async () => {
      const wrappedDek = await this.#getWrappedDek();

      const requestOptions = await this.#createRequest('POST', { wrappedDek, transactionId });
      const response = await fetch(`${this.baseUrl}/pay`, requestOptions);
      const data = await response.json();
      return data;
    };
    try {
      await this.checkTokenAndExecuteFunction(payChargeFn);
    } catch (error: any) {
      console.error('There was an error paying this transaction, error: ', error);
      return error;
    }
  };

  getWallets = (forceRefresh?: boolean) =>
    this.checkTokenAndExecuteFunction(this.#fetchUserWallets, this.user?.wallets, forceRefresh);

  getUserInfo = (forceRefresh?: boolean) =>
    this.checkTokenAndExecuteFunction(this.#fetchUserInfo, this.user?.info, forceRefresh);

  getBalances = (forceRefresh?: boolean) =>
    this.checkTokenAndExecuteFunction(this.#fetchUserBalances, this.user?.balances, forceRefresh);

  getNfts = (forceRefresh?: boolean) =>
    this.checkTokenAndExecuteFunction(this.#fetchUserNfts, this.user?.nfts, forceRefresh);

  createIframe(width: number, height: number) {
    const iframe = document.createElement('iframe');
    switch (this.#environment) {
      case Environments.DEVELOPMENT:
        iframe.src = this.#pwaDevUrl;
        break;

      case Environments.STAGING:
        iframe.src = this.#pwaStagingUrl;
        break;

      default:
        iframe.src = this.#pwaProdUrl;
        break;
    }
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
  }

  isTokenExpired = async () => {
    console.log('this.credentials inside isTokenExpired', this.credentials);
    if (!this.credentials) {
      const user = await this.#oauth2Client?.getUser();
      console.log('user inside isTokenExpired', user);
      if (user) {
        return user.expires_at ? user.expires_at < Math.floor(Date.now() / 1000) : true;
      }
    }
    return this.credentials?.expires_at
      ? this.credentials.expires_at < Math.floor(Date.now() / 1000)
      : true;
  };

  refreshToken = async () => {
    try {
      const user = await this.#oauth2Client?.getUser();
      console.log('user inside refresh token');
      if (
        this.credentials?.expires_at &&
        this.credentials?.expires_at > Math.floor(Date.now() / 1000)
      ) {
        console.log('token is not expired');
        return user;
      }

      if (!this.credentials?.refreshToken && user) {
        this.credentials = {
          refreshToken: user?.refresh_token,
          accessToken: '',
          idToken: '',
          expires_at: 0,
        };
      }
      if (this.credentials?.refreshToken) {
        console.log("token is expired, let's refresh it");
        const userRefreshed = await this.#oauth2Client?.signinSilent();
        console.log('userRefreshed inside refresh token', userRefreshed);
        if (userRefreshed) {
          this.credentials = {
            accessToken: userRefreshed.access_token,
            idToken: userRefreshed.id_token as string,
            refreshToken: userRefreshed.refresh_token,
            expires_at: userRefreshed.expires_at ?? 0,
          };
          return userRefreshed;
        } else return false;
      }
      return false;
    } catch (e) {
      console.error('There was an error refreshing the token, error: ', e);
      return false;
    }
  };

  checkTokenAndExecuteFunction = async (
    fn: Function,
    property: any = undefined,
    forceRefresh: boolean = false
  ) => {
    if (!(await this.isTokenExpired())) {
      if (property && !forceRefresh) return property;
      const data = await fn(forceRefresh);
      return data;
    } else {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const data = await fn(forceRefresh);
        return data;
      } else throw new Error('The session is expired, please login again');
    }
  };
}

export default WebSDK;
