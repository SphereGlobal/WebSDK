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
    OPTIMISM = "OPTIMISM",
    IMMUTABLE = "IMMUTABLE",
    AVALANCHE = "AVALANCHE",
    BINANCE = "BINANCE",
    ARBITRUM = "ARBITRUM",
    FANTOM = "FANTOM",
    EOSEVM = "EOSEVM",
    BASE = "BASE",
    FLOW = "FLOW",
    KLAYTN = "KLAYTN",
    DFK = "DFK"
}
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: SupportedChains | string;
    logoURI: string;
    chain: SupportedChains;
}
export interface Wallet {
    address: string;
    publicKey: string;
    privateKey: string;
    isImported: boolean;
    chains: SupportedChains[];
    type: WalletTypes;
    starkPrivateKey?: string;
}
export interface WalletResponse {
    data: Wallet[] | null;
    error: string | null;
}
export declare enum WalletTypes {
    EOA = "EOA",
    SMART_WALLET = "SmartWallet"
}
export interface User {
    info?: UserInfo;
    wallets?: Wallet[];
    balances?: UserBalance;
    nfts?: NftsInfo[];
    uid?: string;
    transactions?: string;
}
export interface UserInfo {
    uid: string;
    signedUp: boolean;
    waitlistPoints: number;
    email?: string;
    currency: string;
    countryFlag: string;
    referralLink: string;
    countryCode: string;
    name?: string;
    username?: string;
    isMerchant: boolean;
    profilePicture: string;
    isPinCodeSetup?: boolean;
}
export interface UserInfoResponse {
    data: UserInfo | null;
    error: string | null;
}
export interface Credentials {
    accessToken: string;
    idToken: string;
    refreshToken?: string;
    expires_at: number;
}
export interface LoadCredentialsParams {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_at?: number;
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
    chain?: SupportedChains;
    tokenId?: string;
    walletAddress?: string;
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
export interface CallSmartContractProps {
    alias: string;
    nativeValue?: string;
    functionParams?: string[];
}
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
    ethGas: BigNumberObj;
    maticGas: BigNumberObj;
    optGas: BigNumberObj;
    avaxGas: BigNumberObj;
    arbGas: BigNumberObj;
    bscGas: BigNumberObj;
    solGas: BigNumberObj;
    eosEvmGas: BigNumberObj;
    baseGas: BigNumberObj;
    klaytnGas: BigNumberObj;
    dfkGas: BigNumberObj;
}
export declare enum RouteActionType {
    BRIDGE = "BRIDGE",
    SWAP = "SWAP",
    TRANSFER = "TRANSFER"
}
export interface SwapData {
    fromChain: SupportedChains;
    fromAmount: BigNumberObj;
    fromToken: Token;
    fromAddress: string;
    fromPrivateKey: string;
    toAmount: BigNumberObj;
    toToken: Token;
    estimatedGas: BigNumberObj;
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
    toAmount: BigNumberObj;
    fromAmount: BigNumberObj;
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
    fromAmount: BigNumberObj;
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
    fromAmount: BigNumberObj;
    fromAddress: string;
    fromToken: Token;
    toChain: SupportedChains;
    toAmount: BigNumberObj;
    toAddress: string;
    toToken: Token;
    estimatedTime: number;
    estimatedCostUSD: number;
    estimatedEthGas: BigNumberObj;
    estimatedMatGas: BigNumberObj;
    estimatedAvaxGas: BigNumberObj;
    estimatedArbGas: BigNumberObj;
    estimatedBscGas: BigNumberObj;
    estimatedSolGas: BigNumberObj;
    estimatedOptGas: BigNumberObj;
    estimatedEosEvmGas: BigNumberObj;
    estimatedBaseGas: BigNumberObj;
    estimatedKlaytnGas: BigNumberObj;
    estimatedDfkGas: BigNumberObj;
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
    [chain in SupportedChains]: Wallet;
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
    fromAmount: BigNumberObj;
    fromAddress: string;
    fromTokenAddress: string;
    toAddress: string;
    hash: string | null;
    userOperationHash: null | string;
    fromPrivateKey: string;
    transferType: TransferType;
    status: TxStatus;
    fee?: BigNumberObj;
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
export interface PayResponse {
    status: TxStatus;
    route: Route;
}
export declare class PayError extends Error {
    onrampLink?: string;
    constructor({ message, onrampLink }: {
        message: string;
        onrampLink?: string;
    });
}
export declare class RouteEstimateError extends PayError {
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
export interface ForceRefresh {
    forceRefresh?: boolean;
}
export interface GetRouteEstimationParams {
    transactionId: string;
}
export interface GenericErrorCodeResponse {
    code: string;
    message: string;
}
export interface PayRouteEstimateResponse {
    data: PayRouteEstimate | OnRampResponse | null;
    error: GenericErrorCodeResponse | null;
}
export interface PayRouteEstimate {
    txId: string;
    status: TxStatus;
    total: number;
    totalUsd: number;
    estimation: PayRouteTotalEstimation;
    to: PayRouteDestinationEstimate;
    startTimestamp: number;
    limitTimestamp: number;
}
export interface PayRouteTotalEstimation {
    costUsd: number;
    timeEstimate: number;
    gas: string;
    route: string;
    routeParsed?: FormattedBatch[];
}
export interface PayRouteDestinationEstimate {
    toAmount: string;
    toAddress: string;
    toChain: string;
    toToken: Token;
}
export interface ParsedRoute {
    id: string;
    batches: RouteBatch[];
    status: string;
    toToken: Token;
    toAddress: string;
    toChain: string;
    toAmount: string;
    estimate: Estimate;
    fromUid: string;
}
export interface HandleCallback {
    successCallback?: (...args: any) => void;
    failCallback?: (...args: any) => void;
    cancelCallback?: (...args: any) => void;
}
export declare enum BatchType {
    TRANSFER = "TRANSFER",
    SWAP = "SWAP",
    BRIDGE = "BRIDGE"
}
export interface FormattedBatch {
    type: BatchType;
    title: string | null;
    operations: string[];
}
export interface BigNumberObj {
    type: string;
    hex: string;
}
export declare enum PincodeTarget {
    ADD_WALLET = "ADD_WALLET",
    GET_PRIVATE_KEY = "GET_PRIVATE_KEY",
    CHECK_STARK_PRIVATE_KEY = "CHECK_STARK_PRIVATE_KEY",
    SEND_NFT = "SEND_NFT"
}
