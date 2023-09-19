import { ChargeReqBody, Environments, Info, LoginBehavior, NftsInfo, Transaction, User, WalletDoc, iWebSDK, UserBalance, ChargeUrlAndId, PayResponseOnRampLink, PayResponseRouteCreated, PayErrorResponse } from './src/types';
export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from './src/components/LoginButton';
declare class WebSDK implements iWebSDK {
    #private;
    static instance: WebSDK | undefined;
    loginType: LoginBehavior;
    clientId?: string;
    redirectUri?: string;
    apiKey?: string;
    user?: User | null | undefined;
    baseUrl?: string;
    setClientId: (clientId: string) => this;
    setRedirectUri: (redirectUri: string) => this;
    setApiKey: (apiKey: string) => this;
    setBaseUrl: (baseUrl: string) => this;
    setEnvironment: (environment?: Environments) => this;
    setLoginType: (loginType?: LoginBehavior) => this;
    build: () => WebSDK | undefined;
    clear: () => void;
    handleCallback: () => Promise<any>;
    login: () => Promise<any>;
    logout: () => Promise<void>;
    createCharge: (charge: ChargeReqBody) => Promise<ChargeUrlAndId>;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress, }: Transaction) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    payCharge: (transactionId: string) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    getWallets: ({ forceRefresh }?: {
        forceRefresh?: boolean | undefined;
    }) => Promise<WalletDoc[]>;
    getUserInfo: ({ forceRefresh }?: {
        forceRefresh?: boolean | undefined;
    }) => Promise<Info>;
    getBalances: ({ forceRefresh }?: {
        forceRefresh?: boolean | undefined;
    }) => Promise<UserBalance>;
    getNfts: ({ forceRefresh }?: {
        forceRefresh?: boolean | undefined;
    }) => Promise<NftsInfo[]>;
    getTransactions: (props?: {
        quantity: number;
        getReceived: boolean;
        getSent: boolean;
        forceRefresh: boolean;
    }) => Promise<Transaction[]>;
    createIframe(width: number, height: number): HTMLIFrameElement;
    isTokenExpired: () => Promise<boolean>;
}
export default WebSDK;
