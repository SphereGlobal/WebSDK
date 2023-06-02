import auth0 from 'auth0-js';
import { Credentials, User, iWebSDK } from './src/types';

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
  #_PROJECT_ID: string = 'sphereone-testing';
  #_domain: string = 'dev-7mz527mzl0k6ccnp.us.auth0.com';

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

  handleAuth0Callback = () => {
    if (this.auth0Client && !this.providerUid) {
      this.auth0Client.parseHash((err: any, authResult: any) => {
        if (err) {
          console.error('Error login:', err);
        } else if (authResult && authResult.accessToken && authResult.idToken) {
          console.log('AccessToken:', authResult.accessToken);
          console.log('IDToken:', authResult.idToken);
          console.log(authResult);
          this.credentials = {
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
          };
          this.providerUid = authResult.idTokenPayload.sub;
        }
      });
    }
  };

  loginWithAuth0() {
    this.auth0Client.authorize({
      domain: this.#_domain as string,
      responseType: 'token id_token',
    });
  }

  fetchUserBalances = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        data: {
          providerId: this.providerId,
          providerUid: this.providerUid,
          refreshCache: false,
        },
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      };

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

  fetchUserInfo = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        providerId: this.providerId,
        providerUserUid: this.providerUid,
        apiKey: this.apiKey,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      };

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

  getWallets = async () => {
    if (this.user?.wallets) return this.user.wallets;
    const wallets = await this.fetchUserInfo();
    return wallets.data.wallets;
  };

  getUserInfo = async () => {
    if (this.user?.info) return this.user.info;
    const userInfo = await this.fetchUserInfo();
    return userInfo.data.userInfo;
  };

  getBalances = async () => {
    if (this.user?.balances) return this.user.balances;
    const balances = await this.fetchUserBalances();
    return balances;
  };
}

function createIframe(width: number, height: number) {
  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:19006/';
  iframe.width = width.toString();
  iframe.height = height.toString();
  return iframe;
}

export default WebSDK;
export { createIframe };
