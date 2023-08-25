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
    user?: User | null;
    credentials?: Credentials | null;
    balances?: WalletBalance[] | null;
    auth0Client?: any;
    PROJECT_ID?: string;
}
export interface User {
    info?: Info;
    wallets?: WalletDoc[];
    balances?: WalletBalance[];
    nfts?: NftsInfo[];
    uid?: string;
}
export interface Info {
    email?: string;
    name?: string;
    username?: string;
    countryCode?: string;
    blockFundsUntil: {
        _seconds: number;
        _nanoseconds: number;
    };
}
export interface Credentials {
    accessToken: string;
    idToken: string;
    refreshToken?: string;
}
export interface Transaction {
    toAddress: string;
    chain: SupportedChains;
    symbol: string;
    amount: number;
    tokenAddress: string;
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
export declare enum TxStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    CANCELED = "CANCELED",
    WAITING = "WAITING"
}
export interface TransactionEstimate {
    txId: string;
    status: TxStatus;
    total: number;
    totalUsd: number;
    estimation: {
        costUsd: number;
        timeEstimate: number;
        gas: string;
        route: string;
    };
    to: {
        toAmount: string;
        toAddress: string;
        toChain: string;
        toToken: {
            symbol: string;
            name: string;
            decimals: number;
            address: string;
            logoURI: string;
            chain: string;
        };
    };
    startTimestamp: number;
    limitTimestamp: number;
}
