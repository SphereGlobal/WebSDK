import { ChargeReqBody, UserInfo, LoginBehavior, NftsInfo, Transaction, User, Wallet, UserBalance, ChargeUrlAndId, ForceRefresh, SupportedChains, PayResponse, GetRouteEstimationParams, PayRouteEstimate, HandleCallback } from './src/types';
export { LoginButton } from './src/components/LoginButton';
export * from './src/types';
declare class WebSDK {
    #private;
    user: User | null;
    private clientId;
    private redirectUri;
    private apiKey;
    private loginType;
    scope: string;
    pinCodeScreen: Window | null;
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
    payCharge: (transactionId: string) => Promise<PayResponse>;
    getWallets: ({ forceRefresh }?: ForceRefresh) => Promise<Wallet[]>;
    getUserInfo: ({ forceRefresh }?: ForceRefresh) => Promise<UserInfo>;
    getBalances: ({ forceRefresh }?: ForceRefresh) => Promise<UserBalance>;
    getNfts: ({ forceRefresh }?: ForceRefresh) => Promise<NftsInfo[]>;
    transferNft: (nftData: {
        chain: SupportedChains;
        fromAddress: string;
        toAddress: string;
        nftTokenAddress: string;
        tokenId?: string;
        reason?: string;
    }) => Promise<any>;
    getTransactions: (props?: {
        quantity?: number;
        getReceived?: boolean;
        getSent?: boolean;
        forceRefresh?: boolean;
    }) => Promise<Transaction[]>;
    getRouteEstimation: ({ transactionId, }: GetRouteEstimationParams) => Promise<PayRouteEstimate>;
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
    addPinCode: () => void;
    openPinCode: (target?: string) => void;
    pinCodeHandler: (callbacks?: HandleCallback) => void;
    removePinCodeHandler: (callbacks?: HandleCallback) => void;
}
export default WebSDK;
