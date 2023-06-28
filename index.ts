import auth0, { Auth0DecodedHash } from 'auth0-js';
import { Credentials, Transaction, User, iWebSDK } from './src/types';

class WebSDK implements iWebSDK {
  static instance: any;

  loginType: 'REDIRECT' | 'POPUP' = 'REDIRECT';
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  user?: User;
  credentials?: Credentials | null;
  #auth0Client?: any;
  #wrappedDek: string = '';
  #domain: string = 'dev-4fb2r65g1bnesuyt.us.auth0.com';
  #audience: string = 'https://dev-4fb2r65g1bnesuyt.us.auth0.com/api/v2/';
  // #baseUrl: string = 'https://api-g2eggt3ika-uc.a.run.app';
  #baseUrl: string = 'http://127.0.0.1:5001/sphereone-testing/us-central1/api';

  constructor({ clientId, redirectUri, loginType, apiKey }: iWebSDK) {
    if (WebSDK.instance) return WebSDK.instance;
    WebSDK.instance = this;

    this.loginType = loginType;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.apiKey = apiKey;
    this.user = {};
    this.credentials = null;

    this.#auth0Client = new auth0.WebAuth({
      domain: this.#domain as string,
      clientID: this.clientId as string,
      redirectUri: this.redirectUri as string,
      audience: this.#audience as string,
      responseType: 'token id_token',
    });
  }

  handleAuth = async () => {
    const authResult: Auth0DecodedHash = await new Promise((resolve, reject) => {
      this.#auth0Client.parseHash((err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (authResult) {
      this.credentials = {
        accessToken: authResult.accessToken as string,
        idToken: authResult.idToken as string,
      };
      if (this.user) this.user.uid = authResult.idTokenPayload.sub;

      return authResult;
    } else return null;
  };

  handleCallback = async () => {
    try {
      const persistence = await this.handlePersistence();
      if (persistence) return persistence;

      const handleAuth = await this.handleAuth();
      return handleAuth;
    } catch (error) {
      console.log(error);
    } finally {
      if (this.loginType === 'POPUP')
        this.#auth0Client.popup.callback({ hash: window.location.hash });
    }
  };

  handlePersistence = async () => {
    const persistance: Auth0DecodedHash = await new Promise((resolve, reject) => {
      this.#auth0Client.checkSession({}, (err: any, result: Auth0DecodedHash) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (persistance) {
      this.credentials = {
        accessToken: persistance.accessToken as string,
        idToken: persistance.idToken as string,
      };
      if (this.user) this.user.uid = persistance.idTokenPayload.sub;
      return persistance;
    } else return null;
  };

  login = async () => {
    if (this.loginType === 'REDIRECT') {
      this.#auth0Client.authorize();
    } else {
      await new Promise((resolve, reject) => {
        this.#auth0Client.popup.authorize(
          {
            domain: this.#domain,
            redirectUri: this.redirectUri,
            responseType: 'token id_token',
          },
          async (err: any, authResult: any) => {
            if (err) reject(err);
            else {
              this.credentials = {
                accessToken: authResult.accessToken,
                idToken: authResult.idToken,
              };
              resolve(authResult);
            }
          }
        );
      });
    }
  };

  logout = () => {
    this.#auth0Client.logout({
      redirectUri: this.redirectUri,
      returnTo: this.redirectUri,
    });
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
        `${this.#baseUrl}/getFundsAvailable?refreshCache=true`,
        requestOptions
      );

      const data = await response.json();
      if (this.user) this.user.balances = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #fetchUserWallets = async () => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/user/wallets`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.wallets = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #fetchUserInfo = async () => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/user`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.info = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #fetchUserNfts = async () => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/getNftsAvailable`, requestOptions);

      const data = await response.json();
      if (this.user) this.user.nfts = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #getWrappedDek = async () => {
    if (this.#wrappedDek) return this.#wrappedDek;
    try {
      const requestOptions = await this.#createRequest('POST');

      const response = await fetch(`${this.#baseUrl}/createOrRecoverAccount`, requestOptions);

      const data = await response.json();
      this.#wrappedDek = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
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

      const response = await fetch(`${this.#baseUrl}/pay`, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  payCharge = async (transactionId: string) => {
    try {
      const wrappedDek = await this.#getWrappedDek();

      const requestOptions = await this.#createRequest('POST', { wrappedDek, transactionId });

      const response = await fetch(`${this.#baseUrl}/pay`, requestOptions);
      const data = await response.json();
      return data.result.data;
    } catch (error: any) {
      console.log(error);
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
}

function createIframe(width: number, height: number) {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://wallet.sphereone.xyz/';
  iframe.width = width.toString();
  iframe.height = height.toString();
  return iframe;
}

export default WebSDK;
export { createIframe };
