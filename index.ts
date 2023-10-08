import {
  ChargeReqBody,
  ChargeResponse,
  Credentials,
  UserInfo,
  LoginBehavior,
  NftsInfo,
  Transaction,
  User,
  Wallet,
  CreateRequest,
  UserBalance,
  UserBalancesResponse,
  WalletResponse,
  UserInfoResponse,
  NftsInfoResponse,
  TransactionsResponse,
  ChargeUrlAndId,
  WrappedDekResponse,
  PayResponseOnRampLink,
  PayResponseRouteCreated,
  PayErrorResponse,
  LoadCredentialsParams,
  ForceRefresh,
  SupportedChains,
} from './src/types';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { decodeJWT } from './src/utils';

export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from './src/components/LoginButton';

class WebSDK {
  public user: User | null = null;
  private clientId: string;
  private redirectUri: string;
  private apiKey: string;
  private loginType: LoginBehavior = LoginBehavior.REDIRECT;

  #credentials: Credentials | null = null;
  #oauth2Client?: UserManager;
  #wrappedDek: string = '';
  #wrappedDekExpiration: number = 0;
  #domain: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/';
  #audience: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com';
  #pwaProdUrl = 'https://wallet.sphereone.xyz';
  #baseUrl: string = 'https://api-olgsdff53q-uc.a.run.app';
  scope: string = 'openid email offline_access profile';

  constructor(
    clientId: string,
    redirectUri: string,
    apiKey: string,
    loginType: LoginBehavior = LoginBehavior.REDIRECT
  ) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.apiKey = apiKey;
    this.loginType = loginType;
    this.#oauth2Client = new UserManager({
      authority: this.#domain as string,
      client_id: this.clientId as string,
      redirect_uri: this.redirectUri as string,
      response_type: 'code',
      post_logout_redirect_uri: this.redirectUri as string,
      userStore:
        typeof window !== 'undefined'
          ? new WebStorageStateStore({ store: window.localStorage })
          : undefined,
      scope: this.scope,
      automaticSilentRenew: true,
    });
  }

  getAccessToken = (): string => {
    return this.#credentials?.accessToken ?? '';
  };

  getIdToken = (): string => {
    return this.#credentials?.idToken ?? '';
  };

  clear = () => {
    this.user = null;
    this.#credentials = null;
    this.#wrappedDek = '';
  };

  #loadCredentials({ access_token, id_token, refresh_token, expires_at }: LoadCredentialsParams) {
    this.#credentials = {
      accessToken: access_token,
      idToken: id_token ?? '',
      refreshToken: refresh_token,
      expires_at: expires_at ?? 0,
    };
  }

  #handleAuth = async (url?: string, state?: string) => {
    try {
      if (state) {
        const id = JSON.parse(state).id;
        localStorage.setItem(`oidc.${id}`, state);
      }
      const authResult: any = await this.#oauth2Client?.signinCallback(url);

      if (authResult) {
        this.#loadCredentials(authResult);

        if (this.user) {
          this.user.uid = authResult.profile?.sub;
        } else this.user = { uid: authResult.profile?.sub };
        // Load information in state
        this.#loadUserData();

        return authResult;
      } else return null;
    } catch (error: any) {
      // this happens because it tries a login although there is no session/user
      // this piece of code is used with the login.Redirect
      if (error.message.includes('state')) {
        return null;
      }
      throw new Error(error.message || JSON.stringify(error));
    }
  };

  #handlePersistence = async () => {
    const persistence = await this.#oauth2Client?.getUser();
    if (persistence) {
      const isExpired = await this.isTokenExpired();
      if (!isExpired) {
        this.#loadCredentials(persistence);
        if (this.user) this.user.uid = persistence.profile.sub;
        else this.user = { uid: persistence.profile.sub };
        // Load information in state
        this.#loadUserData();

        return persistence;
      } else {
        const refreshed = await this.#refreshToken();
        if (refreshed) {
          this.#loadCredentials(refreshed);
          if (this.user) this.user.uid = refreshed.profile.sub;
          else this.user = { uid: refreshed.profile.sub };
          // Load information in state
          this.#loadUserData();

          return refreshed;
        } else {
          return null;
        }
      }
    } else return null;
  };

  handleCallback = async (url?: string, state?: string) => {
    try {
      const persistence = await this.#handlePersistence();
      if (persistence) return { ...persistence, refresh_token: null };
      const handleAuth = await this.#handleAuth(url, state);
      if (handleAuth) return { ...handleAuth, refresh_token: null };
      else return null;
    } catch (error) {
      console.error('There was an error login, error: ', error);
      return error;
    }
  };

  login = async () => {
    if (this.loginType === LoginBehavior.REDIRECT) {
      await this.#oauth2Client?.signinRedirect({
        extraQueryParams: { audience: this.#audience },
        scope: this.scope,
      });
    } else {
      try {
        const authResult = await this.#oauth2Client?.signinPopup({
          extraQueryParams: { audience: this.#audience },
          scope: this.scope,
        });
        if (authResult) {
          this.#loadCredentials(authResult);
          if (this.user) this.user.uid = authResult.profile.sub;
          else this.user = { uid: authResult.profile.sub };

          // Load information in state
          this.#loadUserData();

          return { ...authResult, refresh_token: null };
        } else return null;
      } catch (error: any) {
        console.error('There was an error logging inside login, error: ', error);
        return error;
      }
    }
  };

  logout = async () => {
    try {
      if (typeof window === 'undefined') return;
      this.#oauth2Client?.signoutSilent();
      this.#oauth2Client?.removeUser();
      window.location.replace(this.redirectUri as string);
      this.clear();
    } catch (e) {
      console.error('error logging out', e);
    }
  };

  #createRequest = async (
    method: 'GET' | 'POST' = 'GET',
    body: { [key: string]: any } = {},
    headers: Headers | {} = {}
  ): Promise<CreateRequest> => {
    // check if access token is valid or can be refresh
    if (await this.isTokenExpired()) {
      const refreshToken = await this.#refreshToken();
      if (!refreshToken)
        throw new Error('The user is not login or the session is expired, please login again');
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${this.#credentials?.accessToken}`);

    if (Object.keys(headers).length) {
      for (const [key, value] of Object.entries(headers)) {
        myHeaders.append(key, value as string);
      }
    }

    let requestOptions: CreateRequest | {} = {};

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

    return requestOptions as CreateRequest;
  };

  #fetchUserBalances = async (): Promise<UserBalance> => {
    try {
      const requestOptions = await this.#createRequest();

      const response = await fetch(
        `${this.#baseUrl}/getFundsAvailable?refreshCache=true`,
        requestOptions
      );

      const data = (await response.json()) as UserBalancesResponse;
      if (data.error) throw new Error(data.error);
      if (this.user && data.data) this.user.balances = data.data;
      return data.data as UserBalance;
    } catch (error: any) {
      console.error('There was an error fetching user balances, error: ', error);
      throw new Error(error.message || error);
    }
  };

  #fetchUserWallets = async (): Promise<Wallet[]> => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/user/wallets`, requestOptions);

      const data = (await response.json()) as WalletResponse;
      if (data.error) throw new Error(data.error);
      if (this.user && data.data) this.user.wallets = data.data;
      return data.data as Wallet[];
    } catch (error: any) {
      console.error('There was an error fetching user wallets, error: ', error);
      throw new Error(error.message || error);
    }
  };

  #fetchUserInfo = async (): Promise<UserInfo> => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/user`, requestOptions);

      const data = (await response.json()) as UserInfoResponse;
      if (data.error) throw new Error(data.error);
      if (this.user && data.data) this.user.info = data.data;
      return data.data as UserInfo;
    } catch (error: any) {
      console.error('There was an error fetching user info, error: ', error);
      throw new Error(error.message || error);
    }
  };

  #fetchUserNfts = async (): Promise<NftsInfo[]> => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/getNftsAvailable`, requestOptions);

      const data = (await response.json()) as NftsInfoResponse;
      if (data.error) throw new Error(data.error);
      if (this.user && data.data) this.user.nfts = data.data;
      return data.data as NftsInfo[];
    } catch (error: any) {
      console.error('There was an error fetching user nfts, error: ', error);
      throw new Error(error.message || error);
    }
  };

  #getWrappedDek = async (): Promise<string> => {
    if (this.#wrappedDek && this.#wrappedDekExpiration * 1000 > Date.now()) return this.#wrappedDek;
    try {
      const requestOptions = await this.#createRequest('POST');

      const response = await fetch(`${this.#baseUrl}/createOrRecoverAccount`, requestOptions);

      const data = (await response.json()) as WrappedDekResponse;
      if (data.error) throw new Error(data.error);
      if (data.data) {
        this.#wrappedDek = data.data;
        this.#wrappedDekExpiration = (await decodeJWT(this.#wrappedDek)).exp * 1000;
      }
      return data.data as string;
    } catch (error: any) {
      console.error('There was an error getting wrapped dek, error: ', error);
      throw new Error(error.message || error);
    }
  };

  #fetchTransactions = async (): Promise<string> => {
    try {
      const requestOptions = await this.#createRequest();
      const response = await fetch(`${this.#baseUrl}/transactions`, requestOptions);

      const data = (await response.json()) as TransactionsResponse;
      if (data.error) throw new Error(data.error);
      if (this.user && data.data) this.user.transactions = data.data;
      return data.data as string;
    } catch (error: any) {
      console.error('There was an error getting transactions, error: ', error);
      throw new Error(error.message || error);
    }
  };

  createCharge = async ({
    chargeData,
    isDirectTransfer = false,
    isTest = false,
  }: {
    chargeData: ChargeReqBody;
    isDirectTransfer?: boolean;
    isTest?: boolean;
  }): Promise<ChargeUrlAndId> => {
    try {
      const requestOptions = await this.#createRequest(
        'POST',
        { chargeData, isDirectTransfer, isTest },
        { 'x-api-key': this.apiKey ?? '' }
      );

      const response = await fetch(`${this.#baseUrl}/createCharge`, requestOptions);
      const data = (await response.json()) as ChargeResponse;
      if (data.error) throw new Error(data.error);
      return data.data as ChargeUrlAndId;
    } catch (error: any) {
      console.error('There was an error creating your transaction, error: ', error);
      throw new Error(error.message || error);
    }
  };

  pay = async ({
    toAddress,
    chain,
    symbol,
    amount,
    tokenAddress,
  }: Transaction): Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse> => {
    try {
      const wrappedDek = await this.#getWrappedDek();
      if (!wrappedDek) throw new Error('There was an error getting the wrapped dek');

      const requestOptions = await this.#createRequest('POST', {
        wrappedDek,
        toAddress,
        chain,
        symbol,
        amount,
        tokenAddress,
      });

      const response = await fetch(`${this.#baseUrl}/pay`, requestOptions);
      return (await response.json()) as
        | PayResponseRouteCreated
        | PayResponseOnRampLink
        | PayErrorResponse;
    } catch (error: any) {
      console.error('There was an processing your payment, error: ', error);
      throw new Error(error.message || error);
    }
  };

  payCharge = async (
    transactionId: string
  ): Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse> => {
    try {
      const wrappedDek = await this.#getWrappedDek();
      if (!wrappedDek) throw new Error('There was an error getting the wrapped dek');
      const requestOptions = await this.#createRequest('POST', { wrappedDek, transactionId });
      const response = await fetch(`${this.#baseUrl}/pay`, requestOptions);
      return (await response.json()) as
        | PayResponseRouteCreated
        | PayResponseOnRampLink
        | PayErrorResponse;
    } catch (error: any) {
      console.error('There was an error paying this transaction, error: ', error);
      throw new Error(error.message || error);
    }
  };

  getWallets = async (
    { forceRefresh }: ForceRefresh = { forceRefresh: false }
  ): Promise<Wallet[]> => this.#getData(this.#fetchUserWallets, this.user?.wallets, forceRefresh);

  getUserInfo = async (
    { forceRefresh }: ForceRefresh = { forceRefresh: false }
  ): Promise<UserInfo> => this.#getData(this.#fetchUserInfo, this.user?.info, forceRefresh);

  getBalances = async (
    { forceRefresh }: ForceRefresh = { forceRefresh: false }
  ): Promise<UserBalance> =>
    this.#getData(this.#fetchUserBalances, this.user?.balances, forceRefresh);

  getNfts = async ({ forceRefresh }: ForceRefresh = { forceRefresh: false }): Promise<NftsInfo[]> =>
    this.#getData(this.#fetchUserNfts, this.user?.nfts, forceRefresh);

  getTransactions = async (
    props: {
      quantity: number;
      getReceived: boolean;
      getSent: boolean;
      forceRefresh: boolean;
    } = {
      quantity: 0,
      getReceived: true,
      getSent: true,
      forceRefresh: false,
    }
  ): Promise<Transaction[]> => {
    // Get all transactions encoded
    let { quantity, getReceived, getSent, forceRefresh } = props;
    if (quantity === undefined) quantity = 0;
    if (getReceived === undefined) getReceived = true;
    if (getSent === undefined) getSent = true;
    if (forceRefresh === undefined) forceRefresh = false;

    const encoded = await this.#getData(
      this.#fetchTransactions,
      this.user?.transactions,
      forceRefresh
    );
    if (!encoded) throw new Error("Couldn't get transactions");
    // Decode JWT payload to get raw transactions
    const { transactions } = await decodeJWT(encoded);
    let response = transactions;

    // if getReceived is set to false, only get the transactions that have "senderUid"
    if (!getReceived) response = transactions.filter((t: any) => t.receiverUid !== this.user?.uid);
    // if getSent is set to false, only get the transactions that have "receiverUid"
    if (!getSent) response = transactions.filter((t: any) => t.senderUid !== this.user?.uid);

    // if quantity is set to higher than 0, only get the transaction quantity else we get all of them
    const limitTxs = quantity > 0 ? response.splice(0, quantity) : response.splice(0);

    // map transactions to have a typed return object
    const txs: Transaction[] = limitTxs.map((t: any) => {
      return {
        date: t.dateCreated || null,
        toAddress: t.toAddress || null,
        chain: t.chain,
        symbol: t.symbol || t.commodity,
        amount: t.total || t.commodityAmount,
        tokenAddress: t.tokenAddress || null,
        nft: {
          img: t.itemInfo?.imageUrl,
          name: t.itemInfo?.name,
          address: t?.address,
        },
      };
    });
    return txs;
  };

  createIframe(width: number, height: number) {
    const iframe = document.createElement('iframe');
    iframe.src = this.#pwaProdUrl;
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
  }

  isTokenExpired = async (): Promise<boolean> => {
    if (!this.#credentials) {
      const user = await this.#oauth2Client?.getUser();
      if (user) {
        return user.expires_at ? user.expires_at < Math.floor(Date.now() / 1000) : true;
      } else return true;
    }
    return this.#credentials?.expires_at
      ? this.#credentials.expires_at < Math.floor(Date.now() / 1000)
      : true;
  };

  #refreshToken = async () => {
    try {
      const user = await this.#oauth2Client?.getUser();
      if (
        this.#credentials?.expires_at &&
        this.#credentials?.expires_at > Math.floor(Date.now() / 1000)
      ) {
        return user;
      }

      if (!this.#credentials?.refreshToken && user) {
        this.#loadCredentials(user);
      }
      if (this.#credentials?.refreshToken) {
        const userRefreshed = await this.#oauth2Client?.signinSilent();
        if (userRefreshed) {
          this.#loadCredentials(userRefreshed);
          return userRefreshed;
        } else return false;
      }
      return false;
    } catch (e) {
      console.error('There was an error refreshing the token, error: ', e);
      return false;
    }
  };

  #getData = (
    fn: () => Promise<any>,
    property: any,
    forceRefresh: boolean = true
  ): Promise<any> => {
    if (property && !forceRefresh) return property;
    else return fn();
  };

  #loadUserData() {
    this.getUserInfo();
    this.getTransactions();
    this.getNfts();
    this.getBalances();
    this.getWallets();
  }

  addWallet = async ({
    walletAddress,
    chains,
    label,
  }: {
    walletAddress: string;
    chains: SupportedChains[];
    label?: string;
  }): Promise<{ data: string; error: null }> => {
    try {
      if (!walletAddress || !chains)
        throw new Error('Missing parameters, walletAddress and chains should be added');
      const requestOptions = await this.#createRequest(
        'POST',
        { walletAddress, chains, label },
        {
          'x-api-key': this.apiKey,
        }
      );
      const response = await fetch(`${this.#baseUrl}/addWallet`, requestOptions);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('There was an error adding a wallet, error: ', error);
      throw new Error(error.message || error);
    }
  };
}

export default WebSDK;
