export interface WalletBalance {
    price: number;
    amount: number;
    address: string;
    chain: SupportedChains;
    tokenMetadata: Token;
}
export declare enum LoginBehavior {
    REDIRECT = "REDIRECT",
    POPUP = "POPUP"
}
export interface Balance {
    tokenMetadata: Token;
    amount: number;
    price: number;
}
export declare enum SupportedChains {
    ETHEREUM = "ETHEREUM",
    SOLANA = "SOLANA",
    POLYGON = "POLYGON",
    GNOSIS = "GNOSIS",
    OPTIMISM = "OPTIMISM",
    IMMUTABLE = "IMMUTABLE",
    AVALANCHE = "AVALANCHE",
    BINANCE = "BINANCE",
    ARBITRUM = "ARBITRUM",
    FANTOM = "FANTOM"
}
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: SupportedChains | string;
    logoURI: string;
    chain: SupportedChains;
}
export interface WalletDoc {
    address: string;
    publicKey: string;
    privateKey: string;
    isImported: boolean;
    chains: SupportedChains[];
    type: WalletTypes;
    starkPrivateKey?: string;
}
export declare enum WalletTypes {
    EOA = "EOA",
    SMART_WALLET = "SmartWallet"
}
export interface iWebSDK {
    loginType: 'REDIRECT' | 'POPUP';
    providerUid?: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    baseUrl?: string;
    apiKey?: string;
    user?: User | null | undefined;
    credentials?: Credentials | null;
    PROJECT_ID?: string;
}
export interface User {
    info?: Info;
    wallets?: WalletDoc[];
    balances?: UserBalance;
    nfts?: NftsInfo[];
    uid?: string;
    transactions?: string;
}
export interface Info {
    uid: string;
    signedUp: boolean;
    waitlistPoints: number;
    email?: string;
    currency: string;
    invitedBy: null | string;
    countryFlag: string;
    referralLink: string;
    countryCode: string;
    name?: string;
    username?: string;
    isMerchant: boolean;
    profilePicture: string;
}
export interface Credentials {
    accessToken: string;
    idToken: string;
    refreshToken?: string;
    expires_at: number;
}
export interface Transaction {
    date?: Date;
    toAddress: string;
    chain: SupportedChains;
    symbol: string;
    amount: number;
    tokenAddress: string;
    nft?: NftsInfo;
}
export type NftsInfo = {
    img: string | undefined;
    name: string | undefined;
    address: string | undefined;
    tokenType?: string;
};
export declare enum Environments {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}
export interface ChargeItem {
    name: string;
    image: string;
    amount: number;
    quantity: number;
    nftUri?: string;
    nftContractAddress?: string;
    nftChain?: SupportedChains;
}
export type ChargeReqBody = {
    tokenAddress: string;
    symbol: string;
    items: ChargeItem[];
    chain: SupportedChains;
    successUrl: string;
    cancelUrl: string;
    amount?: number;
    toAddress?: string;
};
export interface ChargeResponse {
    data: {
        paymentUrl: string;
        chargeId: string;
    } | null;
    error: string | null;
}
export interface CreateRequest {
    method: 'GET' | 'POST';
    headers: Headers;
    body?: string;
}
export declare enum TxStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    CANCELED = "CANCELED",
    WAITING = "WAITING"
}
export interface Estimate {
    time: number;
    costUsd: number;
}
export declare enum RouteActionType {
    BRIDGE = "BRIDGE",
    SWAP = "SWAP",
    TRANSFER = "TRANSFER"
}
export interface SwapData {
    fromChain: SupportedChains;
    fromToken: Token;
    fromAddress: string;
    fromPrivateKey: string;
    toToken: Token;
}
export interface SwapResponse {
    data: SwapResponseData | null;
    error: string | null;
}
export interface SwapResponseData {
    fromChain: SupportedChains;
    fromPrivateKey: string;
    fromAddress: string;
    fromToken: Token;
    toToken: Token;
    userOperation?: {
        userOpHash: string;
        wait: () => Promise<any>;
    };
    userOperationHash: string | null;
    approveTxHash: string | null;
    swapTxHash: string | null;
    approveStatus: TxStatus;
    swapStatus: TxStatus;
    status: TxStatus;
    sponsoredFee?: boolean;
}
export interface TransferData {
    fromChain: SupportedChains;
    fromAddress: string;
    fromPrivateKey: string;
    fromToken: Token;
    toAddress: string;
    smartWallet?: boolean;
    starkPrivateKey?: string;
}
export interface RouteAction {
    type: RouteActionType;
    status: TxStatus;
    estimate: Estimate;
    swapData?: SwapData;
    swapResponse?: SwapResponse;
    transferData?: TransferData;
    transferResponse?: TransferResponse;
    bridgeData?: BridgeProps;
    bridgeResponse?: BridgeResponse;
}
export declare enum BridgeServices {
    WOMRHOLE = "wormhole",
    LIFI = "lifi",
    IMX = "imx",
    STEALTHEX = "stealthex",
    SQUID = "squid",
    SWFT = "swft"
}
export interface BridgeQuote {
    rawQuote: any;
    service: BridgeServices;
    fromChain: SupportedChains;
    fromAddress: string;
    fromToken: Token;
    toChain: SupportedChains;
    toAddress: string;
    toToken: Token;
    estimatedTime: number;
    estimatedCostUSD: number;
    bridgeId?: string;
    depositAddress?: string;
}
export interface BridgeProps {
    quote: BridgeQuote;
    wallets: ChainWallets;
    userSponsoredGas?: number | undefined;
}
export interface BridgeResponse {
    data: BridgeResponseData | null;
    error: string | null;
}
export type ChainWallets = {
    [chain in SupportedChains]: WalletDoc;
};
export interface BridgeResponseData {
    quote: BridgeQuote;
    wallets: ChainWallets;
    bridgeTx: string | null;
    redeemTx: string | null;
    approveTx: string | null;
    postVaaTx: string | null;
    userOperation?: {
        userOpHash: string;
        wait: () => Promise<any>;
    };
    userOperationHash: string | null;
    bridgeStatus: TxStatus;
    redeemStatus: TxStatus;
    approveStatus: TxStatus;
    status: TxStatus;
    sequence?: string;
    emitterAddress?: string;
    bridgeId?: string;
    sponsoredFee?: boolean;
}
export interface TransferResponse {
    data: TransferResponseData | null;
    error: string | null;
}
export interface TransferResponseData {
    fromChain: SupportedChains;
    fromAddress: string;
    fromTokenAddress: string;
    toAddress: string;
    hash: string | null;
    userOperationHash: null | string;
    fromPrivateKey: string;
    transferType: TransferType;
    status: TxStatus;
    rawRecipient?: any;
    sponsoredFee: boolean;
    userOperation?: {
        userOpHash: string;
        wait: () => Promise<any>;
    };
}
export declare enum TransferType {
    SYSTEM = "SYSTEM",
    ERC20 = "ERC20",
    SPL = "SPL"
}
export interface RouteBatch {
    description: string;
    status: TxStatus;
    actions: RouteAction[];
    afterBalances: WalletBalance[];
    estimate: Estimate;
}
export interface Route {
    id?: string;
    toChain?: SupportedChains;
    toAmount?: string;
    toAddress?: string;
    toToken?: Token;
    estimate?: Estimate;
    fromBalances: WalletBalance[];
    status: TxStatus;
    batches: RouteBatch[];
    fromUid?: string;
}
export interface PayResponse {
    error: null;
    data: {
        status: TxStatus;
        route: Route;
    };
}
export interface PayError {
    error: {
        code: string;
        message: string;
    };
    data: {
        status: TxStatus;
        onrampLink: string;
    } | null;
}
export interface UserBalance {
    balances: WalletBalance[];
    total: string;
}
