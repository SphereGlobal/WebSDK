"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _IWebSDK_loadCredentials, _IWebSDK_handleAuth, _IWebSDK_handlePersistence, _IWebSDK_createRequest, _IWebSDK_fetchUserBalances, _IWebSDK_fetchUserWallets, _IWebSDK_fetchUserInfo, _IWebSDK_fetchUserNfts, _IWebSDK_getWrappedDek, _IWebSDK_fetchTransactions, _IWebSDK_refreshToken, _IWebSDK_getData, _IWebSDK_loadUserData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferType = exports.BridgeServices = exports.RouteActionType = exports.TxStatus = exports.Environments = exports.IWebSDK = exports.WalletTypes = exports.SupportedChains = exports.LoginBehavior = void 0;
var LoginBehavior;
(function (LoginBehavior) {
    LoginBehavior["REDIRECT"] = "REDIRECT";
    LoginBehavior["POPUP"] = "POPUP";
})(LoginBehavior || (exports.LoginBehavior = LoginBehavior = {}));
var SupportedChains;
(function (SupportedChains) {
    SupportedChains["ETHEREUM"] = "ETHEREUM";
    SupportedChains["SOLANA"] = "SOLANA";
    SupportedChains["POLYGON"] = "POLYGON";
    SupportedChains["OPTIMISM"] = "OPTIMISM";
    SupportedChains["IMMUTABLE"] = "IMMUTABLE";
    SupportedChains["AVALANCHE"] = "AVALANCHE";
    SupportedChains["BINANCE"] = "BINANCE";
    SupportedChains["ARBITRUM"] = "ARBITRUM";
    SupportedChains["FANTOM"] = "FANTOM";
    SupportedChains["EOSEVM"] = "EOSEVM";
    SupportedChains["BASE"] = "BASE";
    SupportedChains["FLOW"] = "FLOW";
})(SupportedChains || (exports.SupportedChains = SupportedChains = {}));
var WalletTypes;
(function (WalletTypes) {
    WalletTypes["EOA"] = "EOA";
    WalletTypes["SMART_WALLET"] = "SmartWallet";
})(WalletTypes || (exports.WalletTypes = WalletTypes = {}));
// export interface iWebSDK {
//   loginType: LoginBehavior;
//   clientId: string;
//   redirectUri: string;
//   baseUrl: string;
//   apiKey: string;
//   user: User | null;
// }
class IWebSDK {
    // #oauth2Client?: UserManager;
    // #wrappedDek: string = '';
    // #wrappedDekExpiration: number = 0;
    // #domain: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/';
    // #audience: string = 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com';
    // #credentials: Credentials | null = null;
    constructor(clientId, redirectUri, baseUrl, apiKey, loginType = LoginBehavior.REDIRECT) {
        this.baseUrl = 'https://api-olgsdff53q-uc.a.run.app';
        this.user = null;
        this.pwaProdUrl = 'https://wallet.sphereone.xyz';
        _IWebSDK_loadCredentials.set(this, ({ access_token, idToken, refresh_token, expires_at, }) => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_handleAuth.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_handlePersistence.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_fetchUserBalances.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_fetchUserWallets.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_fetchUserNfts.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_getWrappedDek.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_fetchTransactions.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_refreshToken.set(this, () => __awaiter(this, void 0, void 0, function* () { return Promise; }));
        _IWebSDK_getData.set(this, (fn, property, forceRefresh = true) => Promise);
        _IWebSDK_loadUserData.set(this, () => Promise);
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.loginType = loginType;
    }
}
exports.IWebSDK = IWebSDK;
_IWebSDK_loadCredentials = new WeakMap(), _IWebSDK_handleAuth = new WeakMap(), _IWebSDK_handlePersistence = new WeakMap(), _IWebSDK_createRequest = new WeakMap(), _IWebSDK_fetchUserBalances = new WeakMap(), _IWebSDK_fetchUserWallets = new WeakMap(), _IWebSDK_fetchUserInfo = new WeakMap(), _IWebSDK_fetchUserNfts = new WeakMap(), _IWebSDK_getWrappedDek = new WeakMap(), _IWebSDK_fetchTransactions = new WeakMap(), _IWebSDK_refreshToken = new WeakMap(), _IWebSDK_getData = new WeakMap(), _IWebSDK_loadUserData = new WeakMap();
var Environments;
(function (Environments) {
    Environments["DEVELOPMENT"] = "development";
    Environments["STAGING"] = "staging";
    Environments["PRODUCTION"] = "production";
})(Environments || (exports.Environments = Environments = {}));
var TxStatus;
(function (TxStatus) {
    TxStatus["PENDING"] = "PENDING";
    TxStatus["PROCESSING"] = "PROCESSING";
    TxStatus["SUCCESS"] = "SUCCESS";
    TxStatus["FAILURE"] = "FAILURE";
    TxStatus["CANCELED"] = "CANCELED";
    TxStatus["WAITING"] = "WAITING";
})(TxStatus || (exports.TxStatus = TxStatus = {}));
var RouteActionType;
(function (RouteActionType) {
    RouteActionType["BRIDGE"] = "BRIDGE";
    RouteActionType["SWAP"] = "SWAP";
    RouteActionType["TRANSFER"] = "TRANSFER";
})(RouteActionType || (exports.RouteActionType = RouteActionType = {}));
var BridgeServices;
(function (BridgeServices) {
    BridgeServices["WOMRHOLE"] = "wormhole";
    BridgeServices["LIFI"] = "lifi";
    BridgeServices["IMX"] = "imx";
    BridgeServices["STEALTHEX"] = "stealthex";
    BridgeServices["SQUID"] = "squid";
    BridgeServices["SWFT"] = "swft";
})(BridgeServices || (exports.BridgeServices = BridgeServices = {}));
var TransferType;
(function (TransferType) {
    TransferType["SYSTEM"] = "SYSTEM";
    TransferType["ERC20"] = "ERC20";
    TransferType["SPL"] = "SPL";
})(TransferType || (exports.TransferType = TransferType = {}));
