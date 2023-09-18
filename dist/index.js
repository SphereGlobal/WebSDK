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
var _WebSDK_credentials, _WebSDK_environment, _WebSDK_oauth2Client, _WebSDK_wrappedDek, _WebSDK_wrappedDekExpiration, _WebSDK_domainDev, _WebSDK_audienceDev, _WebSDK_domainProd, _WebSDK_audienceProd, _WebSDK_domain, _WebSDK_audience, _WebSDK_pwaDevUrl, _WebSDK_pwaStagingUrl, _WebSDK_pwaProdUrl, _WebSDK_createRequest, _WebSDK_fetchUserBalances, _WebSDK_fetchUserWallets, _WebSDK_fetchUserInfo, _WebSDK_fetchUserNfts, _WebSDK_getWrappedDek, _WebSDK_fetchTransactions;
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
        this.user = undefined;
        _WebSDK_credentials.set(this, void 0);
        _WebSDK_environment.set(this, types_1.Environments.PRODUCTION);
        _WebSDK_oauth2Client.set(this, void 0);
        _WebSDK_wrappedDek.set(this, '');
        _WebSDK_wrappedDekExpiration.set(this, 0);
        _WebSDK_domainDev.set(this, 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com/');
        _WebSDK_audienceDev.set(this, 'https://mystifying-tesla-384ltxo1rt.projects.oryapis.com');
        _WebSDK_domainProd.set(this, 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com/');
        _WebSDK_audienceProd.set(this, 'https://relaxed-kirch-zjpimqs5qe.projects.oryapis.com');
        // by default, points to "PRODUCTION" environment
        _WebSDK_domain.set(this, __classPrivateFieldGet(this, _WebSDK_domainProd, "f"));
        _WebSDK_audience.set(this, __classPrivateFieldGet(this, _WebSDK_audienceProd, "f"));
        this.baseUrl = 'https://api-olgsdff53q-uc.a.run.app';
        _WebSDK_pwaDevUrl.set(this, 'http://localhost:19006');
        _WebSDK_pwaStagingUrl.set(this, 'https://sphereonewallet.web.app');
        _WebSDK_pwaProdUrl.set(this, 'https://wallet.sphereone.xyz');
        this.setClientId = (clientId) => {
            this.clientId = clientId;
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
            if (WebSDK.instance)
                return WebSDK.instance;
            __classPrivateFieldSet(this, _WebSDK_oauth2Client, new oidc_client_ts_1.UserManager({
                authority: __classPrivateFieldGet(this, _WebSDK_domain, "f"),
                client_id: this.clientId,
                redirect_uri: this.redirectUri,
                response_type: 'code',
                post_logout_redirect_uri: this.redirectUri,
                userStore: window ? new oidc_client_ts_1.WebStorageStateStore({ store: window.localStorage }) : undefined,
                scope: 'openid offline_access',
                automaticSilentRenew: true,
            }), "f");
            WebSDK.instance = this;
            return WebSDK.instance;
        };
        this.clear = () => {
            this.user = null;
            __classPrivateFieldSet(this, _WebSDK_credentials, null, "f");
            __classPrivateFieldSet(this, _WebSDK_wrappedDek, '', "f");
        };
        this.handleAuth = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const authResult = yield ((_a = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _a === void 0 ? void 0 : _a.signinCallback());
                if (authResult) {
                    __classPrivateFieldSet(this, _WebSDK_credentials, {
                        accessToken: authResult.access_token,
                        idToken: authResult.id_token,
                        refreshToken: authResult.refresh_token,
                        expires_at: authResult.expires_at,
                    }, "f");
                    if (this.user) {
                        this.user.uid = (_b = authResult.profile) === null || _b === void 0 ? void 0 : _b.sub;
                    }
                    else
                        this.user = { uid: (_c = authResult.profile) === null || _c === void 0 ? void 0 : _c.sub };
                    // Load information in state
                    this.getUserInfo();
                    this.getTransactions();
                    this.getNfts();
                    this.getBalances();
                    this.getWallets();
                    return authResult;
                }
                else
                    return null;
            }
            catch (error) {
                console.error('There was an error loggin inside handleAuth, error: ', error);
                return error;
            }
        });
        this.handlePersistence = () => __awaiter(this, void 0, void 0, function* () {
            var _d, _e, _f;
            const persistence = yield ((_d = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _d === void 0 ? void 0 : _d.getUser());
            if (persistence) {
                const isExpired = yield this.isTokenExpired();
                if (!isExpired) {
                    __classPrivateFieldSet(this, _WebSDK_credentials, {
                        accessToken: persistence.access_token,
                        idToken: persistence.id_token,
                        refreshToken: persistence.refresh_token,
                        expires_at: (_e = persistence.expires_at) !== null && _e !== void 0 ? _e : 0,
                    }, "f");
                    if (this.user)
                        this.user.uid = persistence.profile.sub;
                    else
                        this.user = { uid: persistence.profile.sub };
                    // Load information in state
                    this.getUserInfo();
                    this.getTransactions();
                    this.getNfts();
                    this.getBalances();
                    this.getWallets();
                    return persistence;
                }
                else {
                    const refreshed = yield this.refreshToken();
                    if (refreshed) {
                        __classPrivateFieldSet(this, _WebSDK_credentials, {
                            accessToken: refreshed.access_token,
                            idToken: refreshed.id_token,
                            refreshToken: refreshed.refresh_token,
                            expires_at: (_f = refreshed.expires_at) !== null && _f !== void 0 ? _f : 0,
                        }, "f");
                        if (this.user)
                            this.user.uid = refreshed.profile.sub;
                        else
                            this.user = { uid: refreshed.profile.sub };
                        // Load information in state
                        this.getUserInfo();
                        this.getTransactions();
                        this.getNfts();
                        this.getBalances();
                        this.getWallets();
                        return refreshed;
                    }
                    else {
                        return null;
                    }
                }
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
                console.error('There was an error logging inside handleCallback, error: ', error);
                return error;
            }
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            var _g, _h, _j;
            if (this.loginType === types_1.LoginBehavior.REDIRECT) {
                yield ((_g = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _g === void 0 ? void 0 : _g.signinRedirect({
                    extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                }));
            }
            else {
                try {
                    const authResult = yield ((_h = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _h === void 0 ? void 0 : _h.signinPopup({
                        extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                    }));
                    if (authResult) {
                        __classPrivateFieldSet(this, _WebSDK_credentials, {
                            accessToken: authResult.access_token,
                            idToken: authResult.id_token,
                            refreshToken: authResult.refresh_token,
                            expires_at: (_j = authResult.expires_at) !== null && _j !== void 0 ? _j : 0,
                        }, "f");
                        if (this.user)
                            this.user.uid = authResult.profile.sub;
                        else
                            this.user = { uid: authResult.profile.sub };
                        return authResult;
                    }
                    else
                        return null;
                }
                catch (error) {
                    console.error('There was an error logging inside login, error: ', error);
                    return error;
                }
            }
        });
        this.logout = () => __awaiter(this, void 0, void 0, function* () {
            var _k, _l;
            try {
                if (typeof window === 'undefined')
                    return;
                (_k = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _k === void 0 ? void 0 : _k.signoutSilent();
                (_l = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _l === void 0 ? void 0 : _l.removeUser();
                window.location.replace(this.redirectUri);
                this.clear();
            }
            catch (e) {
                console.error('error logging out', e);
            }
        });
        _WebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            var _m;
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${(_m = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _m === void 0 ? void 0 : _m.accessToken}`);
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
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (this.user && data.data)
                    this.user.balances = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user balances, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        _WebSDK_fetchUserWallets.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/user/wallets`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (this.user && data.data)
                    this.user.wallets = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user wallets, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        _WebSDK_fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/user`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (this.user && data.data)
                    this.user.info = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user info, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        _WebSDK_fetchUserNfts.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/getNftsAvailable`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (this.user && data.data)
                    this.user.nfts = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error fetching user nfts, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        _WebSDK_getWrappedDek.set(this, () => __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _WebSDK_wrappedDek, "f") && __classPrivateFieldGet(this, _WebSDK_wrappedDekExpiration, "f") * 1000 > Date.now())
                return __classPrivateFieldGet(this, _WebSDK_wrappedDek, "f");
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST');
                const response = yield fetch(`${this.baseUrl}/createOrRecoverAccount`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (data.data) {
                    __classPrivateFieldSet(this, _WebSDK_wrappedDek, data.data, "f");
                    __classPrivateFieldSet(this, _WebSDK_wrappedDekExpiration, (yield (0, utils_1.decodeJWT)(__classPrivateFieldGet(this, _WebSDK_wrappedDek, "f"))).exp * 1000, "f");
                }
                return data.data;
            }
            catch (error) {
                console.error('There was an error getting wrapped dek, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        _WebSDK_fetchTransactions.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${this.baseUrl}/transactions`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                if (this.user && data.data)
                    this.user.transactions = data.data;
                return data.data;
            }
            catch (error) {
                console.error('There was an error getting transactions, error: ', error);
                throw new Error(error.message || error);
            }
        }));
        this.createCharge = (charge) => __awaiter(this, void 0, void 0, function* () {
            var _o;
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { chargeData: charge }, { 'x-api-key': (_o = this.apiKey) !== null && _o !== void 0 ? _o : '' });
                const response = yield fetch(`${this.baseUrl}/createCharge`, requestOptions);
                const data = (yield response.json());
                if (data.error)
                    throw new Error(data.error);
                return data.data;
            }
            catch (error) {
                console.error('There was an error creating your transaction, error: ', error);
                throw new Error(error.message || error);
            }
        });
        this.pay = ({ toAddress, chain, symbol, amount, tokenAddress, }) => __awaiter(this, void 0, void 0, function* () {
            const payFn = () => __awaiter(this, void 0, void 0, function* () {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                if (!wrappedDek)
                    throw new Error('There was an error getting the wrapped dek');
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', {
                    wrappedDek,
                    toAddress,
                    chain,
                    symbol,
                    amount,
                    tokenAddress,
                });
                const response = yield fetch(`${this.baseUrl}/pay`, requestOptions);
                return (yield response.json());
            });
            try {
                return yield this.checkTokenAndExecuteFunction(payFn);
            }
            catch (error) {
                console.error('There was an processing your payment, error: ', error);
                throw new Error(error.message || error);
            }
        });
        this.payCharge = (transactionId) => __awaiter(this, void 0, void 0, function* () {
            const payChargeFn = () => __awaiter(this, void 0, void 0, function* () {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                if (!wrappedDek)
                    throw new Error('There was an error getting the wrapped dek');
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { wrappedDek, transactionId });
                const response = yield fetch(`${this.baseUrl}/pay`, requestOptions);
                return (yield response.json());
            });
            try {
                return yield this.checkTokenAndExecuteFunction(payChargeFn);
            }
            catch (error) {
                console.error('There was an error paying this transaction, error: ', error);
                throw new Error(error.message || error);
            }
        });
        this.getWallets = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserWallets, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.wallets, forceRefresh); };
        this.getUserInfo = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserInfo, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.info, forceRefresh); };
        this.getBalances = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserBalances, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.balances, forceRefresh); };
        this.getNfts = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserNfts, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.nfts, forceRefresh); };
        this.getTransactions = (props = {
            quantity: 0,
            getReceived: true,
            getSent: true,
            forceRefresh: false,
        }) => __awaiter(this, void 0, void 0, function* () {
            var _p;
            // Get all transactions encoded
            let { quantity, getReceived, getSent, forceRefresh } = props;
            if (quantity === undefined)
                quantity = 0;
            if (getReceived === undefined)
                getReceived = true;
            if (getSent === undefined)
                getSent = true;
            if (forceRefresh === undefined)
                forceRefresh = false;
            const encoded = yield this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchTransactions, "f"), (_p = this.user) === null || _p === void 0 ? void 0 : _p.transactions, forceRefresh);
            if (!encoded)
                throw new Error("Couldn't get transactions");
            // Decode JWT payload to get raw transactions
            const { transactions } = yield (0, utils_1.decodeJWT)(encoded);
            let response = transactions;
            // if getReceived is set to false, only get the transactions that have "senderUid"
            if (!getReceived)
                response = transactions.filter((t) => { var _a; return t.receiverUid !== ((_a = this.user) === null || _a === void 0 ? void 0 : _a.uid); });
            // if getSent is set to false, only get the transactions that have "receiverUid"
            if (!getSent)
                response = transactions.filter((t) => { var _a; return t.senderUid !== ((_a = this.user) === null || _a === void 0 ? void 0 : _a.uid); });
            // if quantity is set to higher than 0, only get the transaction quantity else we get all of them
            const limitTxs = quantity > 0 ? response.splice(0, quantity) : response.splice(0);
            // map transactions to have a typed return object
            const txs = limitTxs.map((t) => {
                var _a, _b;
                return {
                    date: t.dateCreated || null,
                    toAddress: t.toAddress || null,
                    chain: t.chain,
                    symbol: t.symbol || t.commodity,
                    amount: t.total || t.commodityAmount,
                    tokenAddress: t.tokenAddress || null,
                    nft: {
                        img: (_a = t.itemInfo) === null || _a === void 0 ? void 0 : _a.imageUrl,
                        name: (_b = t.itemInfo) === null || _b === void 0 ? void 0 : _b.name,
                        address: t === null || t === void 0 ? void 0 : t.address,
                    },
                };
            });
            return txs;
        });
        this.isTokenExpired = () => __awaiter(this, void 0, void 0, function* () {
            var _q, _r;
            if (!__classPrivateFieldGet(this, _WebSDK_credentials, "f")) {
                const user = yield ((_q = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _q === void 0 ? void 0 : _q.getUser());
                if (user) {
                    return user.expires_at ? user.expires_at < Math.floor(Date.now() / 1000) : true;
                }
                else
                    return true;
            }
            return ((_r = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _r === void 0 ? void 0 : _r.expires_at)
                ? __classPrivateFieldGet(this, _WebSDK_credentials, "f").expires_at < Math.floor(Date.now() / 1000)
                : true;
        });
        this.refreshToken = () => __awaiter(this, void 0, void 0, function* () {
            var _s, _t, _u, _v, _w, _x, _y;
            try {
                const user = yield ((_s = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _s === void 0 ? void 0 : _s.getUser());
                if (((_t = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _t === void 0 ? void 0 : _t.expires_at) &&
                    ((_u = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _u === void 0 ? void 0 : _u.expires_at) > Math.floor(Date.now() / 1000)) {
                    return user;
                }
                if (!((_v = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _v === void 0 ? void 0 : _v.refreshToken) && user) {
                    __classPrivateFieldSet(this, _WebSDK_credentials, {
                        refreshToken: user === null || user === void 0 ? void 0 : user.refresh_token,
                        accessToken: '',
                        idToken: '',
                        expires_at: 0,
                    }, "f");
                }
                if ((_w = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _w === void 0 ? void 0 : _w.refreshToken) {
                    const userRefreshed = yield ((_x = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _x === void 0 ? void 0 : _x.signinSilent());
                    if (userRefreshed) {
                        __classPrivateFieldSet(this, _WebSDK_credentials, {
                            accessToken: userRefreshed.access_token,
                            idToken: userRefreshed.id_token,
                            refreshToken: userRefreshed.refresh_token,
                            expires_at: (_y = userRefreshed.expires_at) !== null && _y !== void 0 ? _y : 0,
                        }, "f");
                        return userRefreshed;
                    }
                    else
                        return false;
                }
                return false;
            }
            catch (e) {
                console.error('There was an error refreshing the token, error: ', e);
                return false;
            }
        });
        this.checkTokenAndExecuteFunction = (fn, property = undefined, forceRefresh = false) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isTokenExpired())) {
                if (property && !forceRefresh)
                    return property;
                const data = yield fn(forceRefresh);
                return data;
            }
            else {
                const refreshed = yield this.refreshToken();
                if (refreshed) {
                    const data = yield fn(forceRefresh);
                    return data;
                }
                else {
                    this.logout();
                    throw new Error('The session is expired, please login again');
                }
            }
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
_WebSDK_credentials = new WeakMap(), _WebSDK_environment = new WeakMap(), _WebSDK_oauth2Client = new WeakMap(), _WebSDK_wrappedDek = new WeakMap(), _WebSDK_wrappedDekExpiration = new WeakMap(), _WebSDK_domainDev = new WeakMap(), _WebSDK_audienceDev = new WeakMap(), _WebSDK_domainProd = new WeakMap(), _WebSDK_audienceProd = new WeakMap(), _WebSDK_domain = new WeakMap(), _WebSDK_audience = new WeakMap(), _WebSDK_pwaDevUrl = new WeakMap(), _WebSDK_pwaStagingUrl = new WeakMap(), _WebSDK_pwaProdUrl = new WeakMap(), _WebSDK_createRequest = new WeakMap(), _WebSDK_fetchUserBalances = new WeakMap(), _WebSDK_fetchUserWallets = new WeakMap(), _WebSDK_fetchUserInfo = new WeakMap(), _WebSDK_fetchUserNfts = new WeakMap(), _WebSDK_getWrappedDek = new WeakMap(), _WebSDK_fetchTransactions = new WeakMap();
WebSDK.instance = undefined;
exports.default = WebSDK;
