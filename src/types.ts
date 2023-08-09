export interface WalletBalance {
  price: number; // usdc amount bigint
  amount: number; // amount bigint
  address: string; // wallet address
  chain: SupportedChains;
  tokenMetadata: Token;
}

export enum LoginBehavior {
  REDIRECT = 'REDIRECT',
  POPUP = 'POPUP'
}

export interface Balance {
  tokenMetadata: Token;
  amount: number; // amount bigint
  price: number; // usdc amount bigint
}

export enum SupportedChains {
  ETHEREUM = 'ETHEREUM',
  SOLANA = 'SOLANA',
  POLYGON = 'POLYGON',
  GNOSIS = 'GNOSIS',
  OPTIMISM = 'OPTIMISM',
  IMMUTABLE = 'IMMUTABLE',
  AVALANCHE = 'AVALANCHE',
  BINANCE = 'BINANCE',
  ARBITRUM = 'ARBITRUM',
  FANTOM = 'FANTOM',
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

export enum WalletTypes {
  EOA = 'EOA',
  SMART_WALLET = 'SmartWallet',
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

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
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