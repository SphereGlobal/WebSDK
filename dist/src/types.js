"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environments = exports.WalletTypes = exports.SupportedChains = exports.LoginBehavior = void 0;
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
    SupportedChains["GNOSIS"] = "GNOSIS";
    SupportedChains["OPTIMISM"] = "OPTIMISM";
    SupportedChains["IMMUTABLE"] = "IMMUTABLE";
    SupportedChains["AVALANCHE"] = "AVALANCHE";
    SupportedChains["BINANCE"] = "BINANCE";
    SupportedChains["ARBITRUM"] = "ARBITRUM";
    SupportedChains["FANTOM"] = "FANTOM";
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
