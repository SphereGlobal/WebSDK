"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTypes = exports.SupportedChains = void 0;
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
})(SupportedChains = exports.SupportedChains || (exports.SupportedChains = {}));
var WalletTypes;
(function (WalletTypes) {
    WalletTypes["EOA"] = "EOA";
    WalletTypes["SMART_WALLET"] = "SmartWallet";
})(WalletTypes = exports.WalletTypes || (exports.WalletTypes = {}));
