import { BigNumber } from '@ethersproject/bignumber';
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
    FANTOM = "FANTOM",
    EOSEVM = "EOSEVM",
    BASE = "BASE",
    FLOW = "FLOW"
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
export interface WalletResponse {
    data: WalletDoc[] | null;
    error: string | null;
}
export declare enum WalletTypes {
    EOA = "EOA",
    SMART_WALLET = "SmartWallet"
}
export interface iWebSDK {
    loginType: 'REDIRECT' | 'POPUP';
    providerUid?: string;
    clientId?: string;
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
export interface UserInfoResponse {
    data: Info | null;
    error: string | null;
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
export interface NftsInfoResponse {
    data: NftsInfo[] | null;
    error: string | null;
}
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
export interface ChargeUrlAndId {
    paymentUrl: string;
    chargeId: string;
}
export interface ChargeResponse {
    data: ChargeUrlAndId | null;
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
    ethGas: BigNumber;
    maticGas: BigNumber;
    optGas: BigNumber;
    avaxGas: BigNumber;
    arbGas: BigNumber;
    bscGas: BigNumber;
    solGas: BigNumber;
    eosEvmGas: BigNumber;
    baseGas: BigNumber;
}
export declare enum RouteActionType {
    BRIDGE = "BRIDGE",
    SWAP = "SWAP",
    TRANSFER = "TRANSFER"
}
export interface SwapData {
    fromChain: SupportedChains;
    fromAmount: BigNumber;
    fromToken: Token;
    fromAddress: string;
    fromPrivateKey: string;
    toAmount: BigNumber;
    toToken: Token;
    estimatedGas: BigNumber;
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
    toAmount: BigNumber;
    fromAmount: BigNumber;
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
    fromAmount: BigNumber;
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
    fromAmount: BigNumber;
    fromAddress: string;
    fromToken: Token;
    toChain: SupportedChains;
    toAmount: BigNumber;
    toAddress: string;
    toToken: Token;
    estimatedTime: number;
    estimatedCostUSD: number;
    estimatedEthGas: BigNumber;
    estimatedMatGas: BigNumber;
    estimatedAvaxGas: BigNumber;
    estimatedArbGas: BigNumber;
    estimatedBscGas: BigNumber;
    estimatedSolGas: BigNumber;
    estimatedOptGas: BigNumber;
    estimatedEosEvmGas: BigNumber;
    estimatedBaseGas: BigNumber;
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
    fromAmount: BigNumber;
    fromAddress: string;
    fromTokenAddress: string;
    toAddress: string;
    hash: string | null;
    userOperationHash: null | string;
    fromPrivateKey: string;
    transferType: TransferType;
    status: TxStatus;
    fee?: BigNumber;
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
export interface OnRampResponse {
    status: TxStatus;
    onrampLink: string;
}
export interface RouteResponse {
    status: TxStatus;
    route: Route;
}
export interface PayErrorResponse {
    error: string | {
        code: string;
        message: string;
    };
    data: null;
}
export interface PayResponseOnRampLink {
    error: {
        code: string;
        message: string;
    };
    data: OnRampResponse;
}
export interface PayResponseRouteCreated {
    error: null;
    data: RouteResponse;
}
export interface UserBalance {
    balances: WalletBalance[];
    total: string;
}
export interface UserBalancesResponse {
    data: UserBalance | null;
    error: string | null;
}
export interface WrappedDekResponse {
    data: string | null;
    error: null | string;
}
export interface TransactionsResponse {
    data: string | null;
    error: string | null;
}
