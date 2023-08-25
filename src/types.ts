export interface WalletBalance {
  price: number; // usdc amount bigint
  amount: number; // amount bigint
  address: string; // wallet address
  chain: SupportedChains;
  tokenMetadata: Token;
}

export enum LoginBehavior {
  REDIRECT = 'REDIRECT',
  POPUP = 'POPUP',
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

export enum TxStatus {
  PENDING = "PENDING", // Not executed already
  PROCESSING = "PROCESSING", // Waiting to get mined
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  CANCELED = "CANCELED",
  WAITING = "WAITING", // Waiting for user to pay
}

export interface TransactionEstimate {
  txId: string, // transactionId
  status: TxStatus, // TxStatus - WAITING, PROCESSING, COMPLETED, CANCELED, FAILED (should be PENDING)
  total: number, // total amount initially received, not including other costs
  totalUsd: number, // USD value of total amount
  estimation: {
    costUsd: number, // cost (in usd) to make the transaction
    timeEstimate: number, // in minutes, rough estimate (for 60 seconds)
    gas: string, // gas for the transaction
    route: string, // the route batches that will be executed
  },
  to: {
    toAmount: string, // amount to be received
    toAddress: string, // receiver address
    toChain: string, // destination chain
    toToken: { // extra token metadata
      symbol: string,
      name: string,
      decimals: number,
      address: string,
      logoURI: string,
      chain: string,
    },
  },
  startTimestamp: number, // timestamp when response is sent back to client-side
  limitTimestamp: number, // timestamp when this route is still valid, minimum
}