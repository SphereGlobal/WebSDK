import auth0 from 'auth0-js';
import { Credentials, Transaction, User, iWebSDK } from './src/types';

class WebSDK implements iWebSDK {
  static instance: any;

  providerId: string = '';
  providerUid?: string;
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  user?: User;
  credentials?: Credentials | null;
  auth0Client?: any;
  #_PROJECT_ID: string = '<PROJECT_ID>';
  #_domain: string = '<DOMAIN_AUTH0>';
  #_wrappedDek: string = '';

  constructor({ providerId, clientId, redirectUri, apiKey }: iWebSDK) {
    if (WebSDK.instance) return WebSDK.instance;
    WebSDK.instance = this;

    this.providerId = providerId;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.apiKey = apiKey;
    this.providerUid = '';
    this.user = {};
    this.credentials = null;

    this.auth0Client = new auth0.WebAuth({
      domain: this.#_domain as string,
      clientID: this.clientId as string,
      redirectUri: this.redirectUri as string,
      responseType: 'token id_token',
    });
  }

  handleCallback = () => {
    if (this.auth0Client && !this.providerUid) {
      this.auth0Client.parseHash((err: any, authResult: any) => {
        if (err) {
          console.error('Error login:', err);
        } else if (authResult && authResult.accessToken && authResult.idToken) {
          this.credentials = {
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
          };
          this.providerUid = authResult.idTokenPayload.sub;
        }
      });
    }
  };

  login() {
    this.auth0Client.authorize({
      domain: this.#_domain as string,
      responseType: 'token id_token',
    });
  }

  #_createRequest = async (body: any = {}, headers: any = {}, method = 'POST') => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    if (Object.keys(headers).length) {
      for (const [key, value] of Object.entries(headers)) {
        myHeaders.append(key, value as string);
      }
    }

    const raw = JSON.stringify({
      data: {
        providerId: this.providerId,
        providerUid: this.providerUid,
        ...body,
      },
    });

    const requestOptions = {
      method,
      headers: myHeaders,
      body: raw,
    };

    return requestOptions;
  };

  #_fetchUserBalances = async () => {
    try {
      const requestOptions = await this.#_createRequest({ refreshCache: true });

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/getFundsAvailable`,
        requestOptions
      );

      const data = await response.json();
      this.user!.balances = data.result.data.balances;
      return data.result.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #_fetchUserInfo = async () => {
    try {
      const requestOptions = await this.#_createRequest({ apiKey: this.apiKey });

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/user`,
        requestOptions
      );

      const data = await response.json();
      this.user!.info = data.data.userInfo;
      this.user!.wallets = data.data.wallets;
      return data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #_getWrappedDek = async () => {
    try {
      const requestOptions = await this.#_createRequest();

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/createOrRecoverAccount`,
        requestOptions
      );

      const data = await response.json();
      this.#_wrappedDek = data.result.data;
      return data.result.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  pay = async ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => {
    try {
      let wrappedDek = this.#_wrappedDek;
      if (!wrappedDek) wrappedDek = await this.#_getWrappedDek();

      const requestOptions = await this.#_createRequest({
        wrappedDek,
        toAddress,
        chain,
        symbol,
        amount,
        tokenAddress,
      });

      const response = await fetch('https://pay-g2eggt3ika-uc.a.run.app', requestOptions);
      const data = await response.json();
      return data.result.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  payCharge = async (transactionId: string) => {
    try {
      let wrappedDek = this.#_wrappedDek;
      if (!wrappedDek) wrappedDek = await this.#_getWrappedDek();

      const requestOptions = await this.#_createRequest({wrappedDek, transactionId});

      const response = await fetch('https://pay-g2eggt3ika-uc.a.run.app', requestOptions);
      const data = await response.json();
      return data.result.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  getWallets = async () => {
    if (this.user?.wallets) return this.user.wallets;
    const wallets = await this.#_fetchUserInfo();
    return wallets.data.wallets;
  };

  getUserInfo = async () => {
    if (this.user?.info) return this.user.info;
    const userInfo = await this.#_fetchUserInfo();
    return userInfo.data.userInfo;
  };

  getBalances = async () => {
    if (this.user?.balances) return this.user.balances;
    const balances = await this.#_fetchUserBalances();
    return balances;
  };
}

function createIframe(width: number, height: number) {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://<PWA_URL>/';
  iframe.width = width.toString();
  iframe.height = height.toString();
  return iframe;
}

export default WebSDK;
export { createIframe };
