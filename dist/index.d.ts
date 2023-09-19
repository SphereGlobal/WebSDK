import { ChargeReqBody, UserInfo, LoginBehavior, NftsInfo, Transaction, User, Wallet, UserBalance, ChargeUrlAndId, PayResponseOnRampLink, PayResponseRouteCreated, PayErrorResponse, ForceRefresh } from './src/types';
export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from './src/components/LoginButton';
declare class WebSDK {
    #private;
    static instance: WebSDK | undefined;
    user: User | null;
    private clientId;
    private redirectUri;
    private apiKey;
    private loginType;
    constructor(clientId: string, redirectUri: string, apiKey: string, loginType?: LoginBehavior);
    clear: () => void;
    handleCallback: () => Promise<any>;
    login: () => Promise<any>;
    logout: () => Promise<void>;
    createCharge: (charge: ChargeReqBody) => Promise<ChargeUrlAndId>;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress, }: Transaction) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    payCharge: (transactionId: string) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    getWallets: ({ forceRefresh }?: ForceRefresh) => Promise<Wallet[]>;
    getUserInfo: ({ forceRefresh }?: ForceRefresh) => Promise<UserInfo>;
    getBalances: ({ forceRefresh }?: ForceRefresh) => Promise<UserBalance>;
    getNfts: ({ forceRefresh }?: ForceRefresh) => Promise<NftsInfo[]>;
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
