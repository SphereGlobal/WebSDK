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
  OPTIMISM = 'OPTIMISM',
  IMMUTABLE = 'IMMUTABLE',
  AVALANCHE = 'AVALANCHE',
  BINANCE = 'BINANCE',
  ARBITRUM = 'ARBITRUM',
  FANTOM = 'FANTOM',
  EOSEVM = 'EOSEVM',
  BASE = 'BASE',
  FLOW = 'FLOW',
  KLAYTN = 'KLAYTN',
  DFK = 'DFK',
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
export enum WalletTypes {
  EOA = 'EOA',
  SMART_WALLET = 'SmartWallet',
}

export interface User {
  info?: UserInfo;
  wallets?: Wallet[];
  balances?: UserBalance;
  nfts?: NftsInfo[];
  uid?: string;
  transactions?: string; // this data comes as a JWT
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

// for calling on smart contract functions that are whitelisted in Merchant Dashboard
export interface CallSmartContractProps {
  alias: string;
  nativeValue?: string; // must be a string convertable to number
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

export enum TxStatus {
  PENDING = 'PENDING', // Not executed already
  PROCESSING = 'PROCESSING', // Waiting to get mined
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CANCELED = 'CANCELED',
  WAITING = 'WAITING', // Waiting for user to finish the provider flow
}

export interface Estimate {
  time: number; // minutes
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
export enum RouteActionType {
  BRIDGE = 'BRIDGE',
  SWAP = 'SWAP',
  TRANSFER = 'TRANSFER',
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
  userOperationHash: string | null; // Only valid for smart wallets (is used for retrieving the Tx Hash after bundlers execution)
  approveTxHash: string | null; // always null for solana
  swapTxHash: string | null;
  approveStatus: TxStatus;
  swapStatus: TxStatus;
  status: TxStatus; // success when approve and status are done
  sponsoredFee?: boolean;
}

export interface TransferData {
  fromChain: SupportedChains;
  fromAmount: BigNumberObj;
  fromAddress: string;
  fromPrivateKey: string;
  fromToken: Token;
  toAddress: string;
  smartWallet?: boolean; // True by default. Only useful for polygon rn
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

export enum BridgeServices {
  WOMRHOLE = 'wormhole',
  LIFI = 'lifi',
  IMX = 'imx',
  STEALTHEX = 'stealthex',
  SQUID = 'squid',
  SWFT = 'swft',
}
export interface BridgeQuote {
  rawQuote: any; // Raw lifi quote or null
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

  //  is only needed for StealthEX / SWFT bridge
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
  bridgeTx: string | null; // for wormhole this refers to send to bridge tx
  redeemTx: string | null; // wormhole only
  approveTx: string | null; // lifi only. Sometimes allowance is already there so no need for this
  postVaaTx: string | null;
  userOperation?: {
    userOpHash: string;
    wait: () => Promise<any>;
  };
  userOperationHash: string | null; // Only with Smart Wallets to poll TxHash later
  bridgeStatus: TxStatus;
  redeemStatus: TxStatus; // (wormhole only) when using lifi true by default
  approveStatus: TxStatus; // (lifi only) when using wormhole true by default
  status: TxStatus;
  sequence?: string; // wormhole only
  emitterAddress?: string; // wormhole only
  bridgeId?: string; // stealthex/swft only
  sponsoredFee?: boolean; // We can sponsor or not with Smart Wallets
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

export enum TransferType {
  SYSTEM = 'SYSTEM',
  ERC20 = 'ERC20',
  SPL = 'SPL',
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
  error: string | { code: string; message: string };
  data: null;
}
export interface PayResponseOnRampLink {
  error: { code: string; message: string };
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

export class PayError extends Error {
  onrampLink?: string;

  constructor({ message, onrampLink }: { message: string; onrampLink?: string }) {
    super(message);
    this.name = 'PayError';
    this.onrampLink = onrampLink;
  }
}

export class RouteEstimateError extends PayError {}
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
  data: string | null; // this data comes as a JWT
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
  txId: string; // transactionId
  status: TxStatus; // TxStatus - WAITING, PROCESSING, COMPLETED, CANCELED, FAILED (should be PENDING)
  total: number; // total amount initially received, not including other costs
  totalUsd: number; // total amount initially received, in USD, not including other costs
  estimation: PayRouteTotalEstimation;
  to: PayRouteDestinationEstimate;
  startTimestamp: number; // timestamp when response is sent back to client-side
  limitTimestamp: number; // timestamp when this route is still valid, minimum
}

export interface PayRouteTotalEstimation {
  costUsd: number; // cost (in usd) to make the transaction
  timeEstimate: number; // in minutes, rough estimate (for 60 seconds)
  gas: string; // gas for the transaction
  route: string; // the route batches that will be executed
  routeParsed?: FormattedBatch[]; // the route batches that will be executed
}

export interface PayRouteDestinationEstimate {
  toAmount: string; // amount to be received
  toAddress: string; // receiver address
  toChain: string; // destination chain
  toToken: Token; // extra token metadata
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

export enum BatchType {
  TRANSFER = 'TRANSFER',
  SWAP = 'SWAP',
  BRIDGE = 'BRIDGE',
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

export enum PincodeTarget {
  ADD_WALLET = 'ADD_WALLET',
  GET_PRIVATE_KEY = 'GET_PRIVATE_KEY',
  CHECK_STARK_PRIVATE_KEY = 'CHECK_STARK_PRIVATE_KEY',
  SEND_NFT = 'SEND_NFT',
}
