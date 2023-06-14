import auth0 from 'auth0-js';
import { Credentials, Transaction, User, iWebSDK } from './src/types';

class WebSDK implements iWebSDK {
  static instance: any;

  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  user?: User;
  credentials?: Credentials | null;
  #_auth0Client?: any;
  #_PROJECT_ID: string = '<FIREBASE_PROJECT_ID>';
  #_domain: string = '<DOMAIN_AUTH0>';
  #_audience: string = '<AUDIENCE_AUTH0_API>';
  #_wrappedDek: string = '';

  constructor({ clientId, redirectUri, apiKey }: iWebSDK) {
    if (WebSDK.instance) return WebSDK.instance;
    WebSDK.instance = this;

    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.apiKey = apiKey;
    this.user = {};
    this.credentials = null;

    this.#_auth0Client = new auth0.WebAuth({
      domain: this.#_domain as string,
      clientID: this.clientId as string,
      redirectUri: this.redirectUri as string,
      audience: this.#_audience as string,
      responseType: 'token id_token',
    });
  }

  handleCallback = () => {
    // This checks if there is a previous Auth0 session initialized
    this.#_auth0Client.checkSession({}, (err: any, authResult: any) => {
      if (err) {
        // Here falls if there is NO previous session stored
        this.#_auth0Client.parseHash((err: any, authResult: any) => {
          if (err) {
            // Error handling
            console.error('Error login:', err);
          } else if (authResult && authResult.accessToken && authResult.idToken) {
            // Successfull login
            this.credentials = {
              accessToken: authResult.accessToken,
              idToken: authResult.idToken,
            };
            this.user!.uid = authResult.idTokenPayload.sub;
          }
        });
      } else if (authResult) {
        // Here falls if there is a previous session stored
        this.credentials = {
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
        };
        this.user!.uid = authResult.idTokenPayload.sub;
      }
    });
  };

  login() {
    this.#_auth0Client.authorize();
  }

  logout() {
    this.#_auth0Client.logout({
      redirectUri: this.redirectUri,
    })
  }
  #_createRequest = async (body: any = {}, method: string = 'POST', headers: any = {}) => {
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

  #_fetchUserBalances = async () => {
    try {
      const requestOptions = await this.#_createRequest({ refreshCache: true });

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/getFundsAvailable`,
        requestOptions
      );

      const data = await response.json();
      this.user!.balances = data.data.balances;
      return data.data.balances;
    } catch (error: any) {
      console.log(error);
    }
  };

  #_fetchUserWallets = async () => {
    try{
      const requestOptions = await this.#_createRequest({}, 'GET');
      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/user/wallets`,
        requestOptions
      );

      const data = await response.json();
      this.user!.wallets = data.data;
      return data.data;
    } catch (error: any){
      console.log(error)
    }
  }

  #_fetchUserInfo = async () => {
    try {
      const requestOptions = await this.#_createRequest({}, 'GET');
      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/user`,
        requestOptions
      );

      const data = await response.json();
      this.user!.info = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #_fetchUserNfts = async () => {
    try {
      const requestOptions = await this.#_createRequest({}, 'GET');
      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/getNftsAvailable`,
        requestOptions
      );

      const data = await response.json();
      this.user!.nfts = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  #_getWrappedDek = async () => {
    if (this.#_wrappedDek) return this.#_wrappedDek;
    try {
      const requestOptions = await this.#_createRequest();

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/createOrRecoverAccount`,
        requestOptions
      );

      const data = await response.json();
      this.#_wrappedDek = data.data;
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  pay = async ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => {
    try {
      const wrappedDek = await this.#_getWrappedDek();

      const requestOptions = await this.#_createRequest({
        wrappedDek,
        toAddress,
        chain,
        symbol,
        amount,
        tokenAddress,
      });

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/pay`,
        requestOptions
      );
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  payCharge = async (transactionId: string) => {
    try {
      const wrappedDek = await this.#_getWrappedDek();

      const requestOptions = await this.#_createRequest({ wrappedDek, transactionId });

      const response = await fetch(
        `https://us-central1-${this.#_PROJECT_ID}.cloudfunctions.net/api/pay`,
        requestOptions
      );
      const data = await response.json();
      return data.result.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  getWallets = async () => {
    if (this.user?.wallets) return this.user.wallets;
    const wallets = await this.#_fetchUserWallets();
    return wallets;
  };

  getUserInfo = async () => {
    if (this.user?.info) return this.user.info;
    const userInfo = await this.#_fetchUserInfo();
    return userInfo;
  };

  getBalances = async () => {
    if (this.user?.balances) return this.user.balances;
    const balances = await this.#_fetchUserBalances();
    return balances;
  };

  getNfts = async () => {
    if (this.user?.nfts) return this.user.nfts;
    const nfts = await this.#_fetchUserNfts();
    return nfts;
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
