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
import { UserManager } from 'oidc-client-ts';

export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';

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

  #domainDev: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/';
  #audienceDev: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com';
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
    if (!this.clientId) throw new Error('Missing clientId');
    if (!this.clientSecret) throw new Error('Missing clientSecret');
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
          resolve(user);
        } catch (error: any) {
          reject(error);
        }
      });

      if (authResult) {
        this.credentials = {
          accessToken: authResult.access_token,
          idToken: authResult.id_token,
        };
        if (this.user) this.user.uid = authResult.profile.sub;
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
      this.credentials = {
        accessToken: persistence.access_token,
        idToken: persistence.id_token as string,
      };
      if (this.user) this.user.uid = persistence.profile.sub;
      return persistence;
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
    if (this.#wrappedDek) return this.#wrappedDek;
    try {
      const requestOptions = await this.#createRequest('POST');

      const response = await fetch(`${this.baseUrl}/createOrRecoverAccount`, requestOptions);

      const data = await response.json();
      this.#wrappedDek = data.data;
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
    } catch (error: any) {
      console.error('There was an processing your payment, error: ', error);
      return error;
    }
  };

  payCharge = async (transactionId: string) => {
    try {
      const wrappedDek = await this.#getWrappedDek();

      const requestOptions = await this.#createRequest('POST', { wrappedDek, transactionId });
      const response = await fetch(`${this.baseUrl}/pay`, requestOptions);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('There was an error paying this transaction, error: ', error);
      return error;
    }
  };

  getWallets = async () => {
    if (this.user?.wallets) return this.user.wallets;
    const wallets = await this.#fetchUserWallets();
    return wallets;
  };

  getUserInfo = async () => {
    if (this.user?.info) return this.user.info;
    const userInfo = await this.#fetchUserInfo();
    return userInfo;
  };

  getBalances = async () => {
    if (this.user?.balances) return this.user.balances;
    const balances = await this.#fetchUserBalances();
    return balances;
  };

  getNfts = async () => {
    if (this.user?.nfts) return this.user.nfts;
    const nfts = await this.#fetchUserNfts();
    return nfts;
  };

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
}

export default WebSDK;
