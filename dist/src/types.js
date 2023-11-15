"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchType = exports.RouteEstimateError = exports.PayError = exports.TransferType = exports.BridgeServices = exports.RouteActionType = exports.TxStatus = exports.Environments = exports.WalletTypes = exports.SupportedChains = exports.LoginBehavior = void 0;
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
    SupportedChains["KLAYTN"] = "KLAYTN";
    SupportedChains["DFK"] = "DFK";
})(SupportedChains || (exports.SupportedChains = SupportedChains = {}));
var WalletTypes;
(function (WalletTypes) {
    WalletTypes["EOA"] = "EOA";
    WalletTypes["SMART_WALLET"] = "SmartWallet";
})(WalletTypes || (exports.WalletTypes = WalletTypes = {}));
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
class PayError extends Error {
    constructor({ message, onrampLink }) {
        super(message);
        this.name = 'PayError';
        this.onrampLink = onrampLink;
    }
}
exports.PayError = PayError;
class RouteEstimateError extends PayError {
}
exports.RouteEstimateError = RouteEstimateError;
var BatchType;
(function (BatchType) {
    BatchType["TRANSFER"] = "TRANSFER";
    BatchType["SWAP"] = "SWAP";
    BatchType["BRIDGE"] = "BRIDGE";
})(BatchType || (exports.BatchType = BatchType = {}));
