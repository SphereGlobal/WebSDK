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
  user?: User = {};
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
    });

    WebSDK.instance = this;
    return WebSDK.instance as WebSDK;
  };

  clear = () => {
    this.user = {};
    this.credentials = null;
    this.#wrappedDek = '';
  };

  handleAuth = async () => {
    try {
      const authResult: any = await new Promise(async (resolve, reject) => {
        try {
          const user = await this.#oauth2Client?.signinCallback();
          console.log('user in webSDK 124', user);
          resolve(user);
        } catch (error: any) {
          console.log('error 127');
          reject(error);
        }
      });
      console.log('authResult in webSDK 131', authResult);
      if (authResult) {
        this.credentials = {
          accessToken: authResult.access_token,
          idToken: authResult.id_token,
          refreshToken: authResult.refresh_token,
          expires_at: authResult.expires_at,
        };

        if (this.user) {
          this.user.uid = authResult.profile.sub;
          // add expires_at to user
        }
        return authResult;
      } else return null;
    } catch (error: any) {
      console.error('There was an error loggin in, error: ', error);
      return error;
    }
  };

  handlePersistence = async () => {
    const persistence = await this.#oauth2Client?.getUser();
    if (persistence) {
      if (!this.isTokenExpired) {
        this.credentials = {
          accessToken: persistence.access_token,
          idToken: persistence.id_token as string,
          refreshToken: persistence.refresh_token,
          expires_at: persistence.expires_at ?? 0,
        };
        if (this.user) this.user.uid = persistence.profile.sub;
        return persistence;
      } else {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          this.credentials = {
            accessToken: refreshed.access_token,
            idToken: refreshed.id_token as string,
            refreshToken: refreshed.refresh_token,
            expires_at: refreshed.expires_at ?? 0,
          };
          if (this.user) this.user.uid = refreshed.profile.sub;
          return refreshed;
        } else return null;
      }
    } else return null;
  };

  handleCallback = async () => {
    try {
      const persistence = await this.handlePersistence();
      if (persistence) return persistence;

      const handleAuth = await this.handleAuth();
      return handleAuth;
    } catch (error) {
      console.error('There was an error logging in , error: ', error);
      return error;
    }
  };

  login = async () => {
    if (this.loginType === LoginBehavior.REDIRECT) {
      this.#oauth2Client?.signinRedirect({
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
          return authResult;
        } else return null;
      } catch (error: any) {
        console.error('There was an error logging in , error: ', error);
        return error;
      }
    }
  };

  logout = () => {
    if (typeof window === 'undefined') return;
    this.#oauth2Client?.signoutSilent();
    window.location.replace(this.redirectUri as string);
    this.clear();
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

  #fetchUserWallets = async () => {
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
    try {
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
      if (!this.isTokenExpired) {
        return await payFn();
      }
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return await payFn();
      } else throw new Error('The session is expired, please login again');
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
      if (!this.isTokenExpired()) {
        return await payChargeFn();
      }
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return await payChargeFn();
      } else throw new Error('The session is expired, please login again');
    } catch (error: any) {
      console.error('There was an error paying this transaction, error: ', error);
      return error;
    }
  };

  getWallets = async () =>
    this.checkTokenAndExecuteFunction(this.user?.wallets, this.#fetchUserWallets);

  getUserInfo = async () =>
    await this.checkTokenAndExecuteFunction(this.user?.info, this.#fetchUserInfo);

  getBalances = async () =>
    await this.checkTokenAndExecuteFunction(this.user?.balances, this.#fetchUserBalances);

  getNfts = async () => this.checkTokenAndExecuteFunction(this.user?.nfts, this.#fetchUserNfts);

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

  isTokenExpired = () =>
    this.credentials?.expires_at
      ? this.credentials.expires_at < Math.floor(Date.now() / 1000)
      : true;

  refreshToken = async () => {
    try {
      console.log('refresh Token');
      console.log('credentials', this.credentials);
      if (this.credentials?.refreshToken) {
        console.log('trying to refresh token');
        console.log('old credentials', this.credentials);
        const userRefreshed = await this.#oauth2Client?.signinSilent({
          extraQueryParams: { audience: this.#audience },
        });
        console.log('userRefreshed: ', userRefreshed);
        if (userRefreshed) {
          this.credentials = {
            accessToken: userRefreshed.access_token,
            idToken: userRefreshed.id_token as string,
            refreshToken: userRefreshed.refresh_token,
            expires_at: userRefreshed.expires_at ?? 0,
          };
          console.log('new credentials', this.credentials);
          return userRefreshed;
        } else return false;
      }
      return false;
    } catch (e) {
      console.error('There was an error refreshing the token, error: ', e);
      return false;
    }
  };
  checkTokenAndExecuteFunction = async (property: any, fn: Function) => {
    if (!this.isTokenExpired()) {
      if (property) return property;
      const data = await fn();
      return data;
    } else {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const data = await fn();
        return data;
      } else throw new Error('The session is expired, please login again');
    }
  };
}

export default WebSDK;
