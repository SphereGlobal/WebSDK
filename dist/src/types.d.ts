export interface WalletBalance {
    price: number;
    amount: number;
    address: string;
    chain: SupportedChains;
    tokenMetadata: Token;
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
    providerId: string;
    providerUid?: string;
    clientId?: string;
    redirectUri?: string;
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
}
