import { ChargeReqBody, UserInfo, LoginBehavior, NftsInfo, Transaction, User, Wallet, UserBalance, ChargeUrlAndId, PayResponseOnRampLink, PayResponseRouteCreated, PayErrorResponse, ForceRefresh, SupportedChains } from './src/types';
export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from './src/components/LoginButton';
declare class WebSDK {
    #private;
    user: User | null;
    private clientId;
    private redirectUri;
    private apiKey;
    private loginType;
    scope: string;
    constructor(clientId: string, redirectUri: string, apiKey: string, loginType?: LoginBehavior);
    getAccessToken: () => string;
    getIdToken: () => string;
    clear: () => void;
    handleCallback: (url?: string) => Promise<any>;
    login: () => Promise<any>;
    logout: (withPageReload?: boolean) => Promise<void>;
    createCharge: ({ chargeData, isDirectTransfer, isTest, }: {
        chargeData: ChargeReqBody;
        isDirectTransfer?: boolean | undefined;
        isTest?: boolean | undefined;
    }) => Promise<ChargeUrlAndId>;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress, }: Transaction) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    payCharge: (transactionId: string) => Promise<PayResponseRouteCreated | PayResponseOnRampLink | PayErrorResponse>;
    getWallets: ({ forceRefresh }?: ForceRefresh) => Promise<Wallet[]>;
    getUserInfo: ({ forceRefresh }?: ForceRefresh) => Promise<UserInfo>;
    getBalances: ({ forceRefresh }?: ForceRefresh) => Promise<UserBalance>;
    getNfts: ({ forceRefresh }?: ForceRefresh) => Promise<NftsInfo[]>;
    getTransactions: (props?: {
        quantity?: number;
        getReceived?: boolean;
        getSent?: boolean;
        forceRefresh?: boolean;
    }) => Promise<Transaction[]>;
    createIframe(width: number, height: number): HTMLIFrameElement;
    isTokenExpired: () => Promise<boolean>;
    addWallet: ({ walletAddress, chains, label, }: {
        walletAddress: string;
        chains: SupportedChains[];
        label?: string | undefined;
    }) => Promise<{
        data: string;
        error: null;
    }>;
}
export default WebSDK;
