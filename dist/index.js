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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _WebSDK_environment, _WebSDK_oauth2Client, _WebSDK_wrappedDek, _WebSDK_domainDev, _WebSDK_audienceDev, _WebSDK_domainProd, _WebSDK_audienceProd, _WebSDK_domain, _WebSDK_audience, _WebSDK_pwaDevUrl, _WebSDK_pwaStagingUrl, _WebSDK_pwaProdUrl, _WebSDK_createRequest, _WebSDK_fetchUserBalances, _WebSDK_fetchUserWallets, _WebSDK_fetchUserInfo, _WebSDK_fetchUserNfts, _WebSDK_getWrappedDek, _WebSDK_fetchTransactions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginButton = exports.LoginBehavior = exports.SupportedChains = exports.SphereEnvironment = void 0;
const types_1 = require("./src/types");
const oidc_client_ts_1 = require("oidc-client-ts");
const utils_1 = require("./src/utils");
var types_2 = require("./src/types");
Object.defineProperty(exports, "SphereEnvironment", { enumerable: true, get: function () { return types_2.Environments; } });
var types_3 = require("./src/types");
Object.defineProperty(exports, "SupportedChains", { enumerable: true, get: function () { return types_3.SupportedChains; } });
var types_4 = require("./src/types");
Object.defineProperty(exports, "LoginBehavior", { enumerable: true, get: function () { return types_4.LoginBehavior; } });
var LoginButton_1 = require("./src/components/LoginButton");
Object.defineProperty(exports, "LoginButton", { enumerable: true, get: function () { return LoginButton_1.LoginButton; } });
class WebSDK {
    constructor() {
        this.loginType = types_1.LoginBehavior.REDIRECT;
        this.user = {};
        _WebSDK_environment.set(this, types_1.Environments.PRODUCTION);
        _WebSDK_oauth2Client.set(this, void 0);
        _WebSDK_wrappedDek.set(this, '');
        _WebSDK_domainDev.set(this, 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com/');
        _WebSDK_audienceDev.set(this, 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com');
        _WebSDK_domainProd.set(this, 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/');
        _WebSDK_audienceProd.set(this, 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com');
        // by default, points to "DEVELOPMENT" environment
        _WebSDK_domain.set(this, __classPrivateFieldGet(this, _WebSDK_domainDev, "f"));
        _WebSDK_audience.set(this, __classPrivateFieldGet(this, _WebSDK_audienceDev, "f"));
        _WebSDK_pwaDevUrl.set(this, 'http://localhost:19006');
        _WebSDK_pwaStagingUrl.set(this, 'https://sphereonewallet.web.app');
        _WebSDK_pwaProdUrl.set(this, 'https://wallet.sphereone.xyz');
        this.setClientId = (clientId) => {
            this.clientId = clientId;
            return this;
        };
        this.setClientSecret = (clientSecret) => {
            this.clientSecret = clientSecret;
            return this;
        };
        this.setRedirectUri = (redirectUri) => {
            this.redirectUri = redirectUri;
            return this;
        };
        this.setApiKey = (apiKey) => {
            this.apiKey = apiKey;
            return this;
        };
        this.setBaseUrl = (baseUrl) => {
            // trim and remove trailing slash `/`
            const newBaseUrl = baseUrl.trim();
            this.baseUrl = newBaseUrl.endsWith('/') ? newBaseUrl.slice(0, -1) : newBaseUrl;
            return this;
        };
        this.setEnvironment = (environment = types_1.Environments.PRODUCTION) => {
            __classPrivateFieldSet(this, _WebSDK_environment, environment, "f");
            if (environment === types_1.Environments.DEVELOPMENT || environment === types_1.Environments.STAGING) {
                __classPrivateFieldSet(this, _WebSDK_domain, __classPrivateFieldGet(this, _WebSDK_domainDev, "f"), "f");
                __classPrivateFieldSet(this, _WebSDK_audience, __classPrivateFieldGet(this, _WebSDK_audienceDev, "f"), "f");
            }
            else {
                __classPrivateFieldSet(this, _WebSDK_domain, __classPrivateFieldGet(this, _WebSDK_domainProd, "f"), "f");
                __classPrivateFieldSet(this, _WebSDK_audience, __classPrivateFieldGet(this, _WebSDK_audienceProd, "f"), "f");
            }
            return this;
        };
        this.setLoginType = (loginType = types_1.LoginBehavior.REDIRECT) => {
            this.loginType = loginType;
            return this;
        };
        this.build = () => {
            if (typeof window === 'undefined')
                return;
            if (!this.clientId)
                throw new Error('Missing clientId');
            if (!this.redirectUri)
                throw new Error('Missing redirectUri');
            if (!this.apiKey)
                throw new Error('Missing apiKey');
            if (!this.baseUrl)
                throw new Error('Missing baseUrl');
            if (WebSDK.instance)
                return WebSDK.instance;
            __classPrivateFieldSet(this, _WebSDK_oauth2Client, new oidc_client_ts_1.UserManager({
                authority: __classPrivateFieldGet(this, _WebSDK_domain, "f"),
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                response_type: 'code',
                post_logout_redirect_uri: this.redirectUri,
                userStore: window ? new oidc_client_ts_1.WebStorageStateStore({ store: window.localStorage }) : undefined,
            }), "f");
            WebSDK.instance = this;
            return WebSDK.instance;
        };
        this.clear = () => {
            this.user = {};
            this.credentials = null;
            __classPrivateFieldSet(this, _WebSDK_wrappedDek, '', "f");
        };
        this.handleAuth = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const authResult = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        const user = yield ((_a = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _a === void 0 ? void 0 : _a.signinCallback());
                        resolve(user);
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
                if (authResult) {
                    this.credentials = {
                        accessToken: authResult.access_token,
                        idToken: authResult.id_token,
                    };
                    if (this.user)
                        this.user.uid = authResult.profile.sub;
                    return authResult;
                }
                else
                    return null;
            }
            catch (error) {
                console.error('There was an error loggin in, error: ', error);
                return error;
            }
        });
        this.handlePersistence = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const persistence = yield ((_b = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _b === void 0 ? void 0 : _b.getUser());
            if (persistence) {
                this.credentials = {
                    accessToken: persistence.access_token,
                    idToken: persistence.id_token,
                };
                if (this.user)
                    this.user.uid = persistence.profile.sub;
                return persistence;
            }
            else
                return null;
        });
        this.handleCallback = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const persistence = yield this.handlePersistence();
                if (persistence)
                    return persistence;
                const handleAuth = yield this.handleAuth();
                return handleAuth;
            }
            catch (error) {
                console.error('There was an error logging in , error: ', error);
                return error;
            }
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            if (this.loginType === types_1.LoginBehavior.REDIRECT) {
                (_c = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _c === void 0 ? void 0 : _c.signinRedirect({
                    extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                });
            }
            else {
                try {
                    const authResult = yield ((_d = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _d === void 0 ? void 0 : _d.signinPopup({
                        extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                    }));
                    if (authResult) {
                        this.credentials = {
                            accessToken: authResult.access_token,
                            idToken: authResult.id_token,
                        };
                        if (this.user)
                            this.user.uid = authResult.profile.sub;
                        return authResult;
                    }
                    else
                        return null;
                }
                catch (error) {
                    console.error('There was an error logging in , error: ', error);
                    return error;
                }
            }
        });
        this.logout = () => {
            var _a;
            if (typeof window === 'undefined')
                return;
            (_a = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _a === void 0 ? void 0 : _a.signoutSilent();
            window.location.replace(this.redirectUri);
            this.clear();
        };
        _WebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${(_e = this.credentials) === null || _e === void 0 ? void 0 : _e.accessToken}`);
            if (Object.keys(headers).length) {
                for (const [key, value] of Object.entries(headers)) {
                    myHeaders.append(key, value);
                }
            }
            let requestOptions = {};
            if (method === 'GET') {
                requestOptions = {
                    method,
                    headers: myHeaders,
                };
            }
            else {
                const raw = JSON.stringify(Object.assign({}, body));
                requestOptions = {
                    method,
                    headers: myHeaders,
                    body: raw,
                };
            }
            return requestOptions;
        }));
        _WebSDK_fetchUserBalances.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/getFundsAvailable?refreshCache=true`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.balances = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user balances, error: ', error);
                return error;
            }
        }));
        _WebSDK_fetchUserWallets.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/user/wallets`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.wallets = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user wallets, error: ', error);
                return error;
            }
        }));
        _WebSDK_fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/user`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.info = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user info, error: ', error);
                return error;
            }
        }));
        _WebSDK_fetchUserNfts.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/getNftsAvailable`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.nfts = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user nfts, error: ', error);
                return error;
            }
        }));
        _WebSDK_getWrappedDek.set(this, () => __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _WebSDK_wrappedDek, "f"))
                return __classPrivateFieldGet(this, _WebSDK_wrappedDek, "f");
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST');
                const response = yield fetch(`${this.baseUrl}/createOrRecoverAccount`, requestOptions);
                const data = yield response.json();
                __classPrivateFieldSet(this, _WebSDK_wrappedDek, data.data, "f");
                return data.data;
            }
            catch (error) {
                console.error('There was an error getting wrapped dek, error: ', error);
                return error;
            }
        }));
        _WebSDK_fetchTransactions.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/transactions`, requestOptions);
                const data = yield response.json();
                return data.data;
            }
            catch (error) {
                console.error('There was an error getting transactions, error: ', error);
                return error;
            }
        }));
        this.createCharge = (charge) => __awaiter(this, void 0, void 0, function* () {
            var _f;
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { chargeData: charge }, { 'x-api-key': (_f = this.apiKey) !== null && _f !== void 0 ? _f : '' });
                const response = yield fetch(`${this.baseUrl}/createCharge`, requestOptions);
                const data = yield response.json();
                return data.data;
            }
            catch (error) {
                console.error('There was an error creating your transaction, error: ', error);
                return error;
            }
        });
        this.pay = ({ toAddress, chain, symbol, amount, tokenAddress }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', {
                    wrappedDek,
                    toAddress,
                    chain,
                    symbol,
                    amount,
                    tokenAddress,
                });
                const response = yield fetch(`${this.baseUrl}/pay`, requestOptions);
                const data = yield response.json();
                return data.data;
            }
            catch (error) {
                console.error('There was an processing your payment, error: ', error);
                return error;
            }
        });
        this.payCharge = (transactionId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { wrappedDek, transactionId });
                const response = yield fetch(`${this.baseUrl}/pay`, requestOptions);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('There was an error paying this transaction, error: ', error);
                return error;
            }
        });
        this.getTransactions = (quantity = 0, getReceived = true, getSent = true) => __awaiter(this, void 0, void 0, function* () {
            const encoded = yield __classPrivateFieldGet(this, _WebSDK_fetchTransactions, "f").call(this);
            const { transactions } = yield (0, utils_1.decodeJWT)(encoded);
            let response = transactions;
            if (!getReceived)
                response = transactions.filter((t) => { var _a; return t.receiverUid !== ((_a = this.user) === null || _a === void 0 ? void 0 : _a.uid); });
            if (!getSent)
                response = transactions.filter((t) => { var _a; return t.senderUid !== ((_a = this.user) === null || _a === void 0 ? void 0 : _a.uid); });
            const limitTxs = quantity > 0 ? response.splice(0, quantity) : response.splice(0);
            const txs = limitTxs.map((t) => {
                return {
                    date: t.dateCreated || null,
                    toAddress: t.toAddress || null,
                    chain: t.chain,
                    symbol: t.symbol || t.commodity,
                    amount: t.total || t.commodityAmount,
                    tokenAddress: t.tokenAddress || null,
                    nft: {
                        img: t.itemInfo.imageUrl,
                        name: t.itemInfo.name,
                        address: t.address,
                    }
                };
            });
            return txs;
        });
        this.getWallets = () => __awaiter(this, void 0, void 0, function* () {
            var _g;
            if ((_g = this.user) === null || _g === void 0 ? void 0 : _g.wallets)
                return this.user.wallets;
            const wallets = yield __classPrivateFieldGet(this, _WebSDK_fetchUserWallets, "f").call(this);
            return wallets;
        });
        this.getUserInfo = () => __awaiter(this, void 0, void 0, function* () {
            var _h;
            if ((_h = this.user) === null || _h === void 0 ? void 0 : _h.info)
                return this.user.info;
            const userInfo = yield __classPrivateFieldGet(this, _WebSDK_fetchUserInfo, "f").call(this);
            return userInfo;
        });
        this.getBalances = () => __awaiter(this, void 0, void 0, function* () {
            var _j;
            if ((_j = this.user) === null || _j === void 0 ? void 0 : _j.balances)
                return this.user.balances;
            const balances = yield __classPrivateFieldGet(this, _WebSDK_fetchUserBalances, "f").call(this);
            return balances;
        });
        this.getNfts = () => __awaiter(this, void 0, void 0, function* () {
            var _k;
            if ((_k = this.user) === null || _k === void 0 ? void 0 : _k.nfts)
                return this.user.nfts;
            const nfts = yield __classPrivateFieldGet(this, _WebSDK_fetchUserNfts, "f").call(this);
            return nfts;
        });
    }
    createIframe(width, height) {
        const iframe = document.createElement('iframe');
        switch (__classPrivateFieldGet(this, _WebSDK_environment, "f")) {
            case types_1.Environments.DEVELOPMENT:
                iframe.src = __classPrivateFieldGet(this, _WebSDK_pwaDevUrl, "f");
                break;
            case types_1.Environments.STAGING:
                iframe.src = __classPrivateFieldGet(this, _WebSDK_pwaStagingUrl, "f");
                break;
            default:
                iframe.src = __classPrivateFieldGet(this, _WebSDK_pwaProdUrl, "f");
                break;
        }
        iframe.width = width.toString();
        iframe.height = height.toString();
        return iframe;
    }
}
_WebSDK_environment = new WeakMap(), _WebSDK_oauth2Client = new WeakMap(), _WebSDK_wrappedDek = new WeakMap(), _WebSDK_domainDev = new WeakMap(), _WebSDK_audienceDev = new WeakMap(), _WebSDK_domainProd = new WeakMap(), _WebSDK_audienceProd = new WeakMap(), _WebSDK_domain = new WeakMap(), _WebSDK_audience = new WeakMap(), _WebSDK_pwaDevUrl = new WeakMap(), _WebSDK_pwaStagingUrl = new WeakMap(), _WebSDK_pwaProdUrl = new WeakMap(), _WebSDK_createRequest = new WeakMap(), _WebSDK_fetchUserBalances = new WeakMap(), _WebSDK_fetchUserWallets = new WeakMap(), _WebSDK_fetchUserInfo = new WeakMap(), _WebSDK_fetchUserNfts = new WeakMap(), _WebSDK_getWrappedDek = new WeakMap(), _WebSDK_fetchTransactions = new WeakMap();
WebSDK.instance = undefined;
exports.default = WebSDK;
