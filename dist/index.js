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
var _WebSDK_environment, _WebSDK_oauth2Client, _WebSDK_wrappedDek, _WebSDK_wrappedDekExpiration, _WebSDK_domainDev, _WebSDK_audienceDev, _WebSDK_domainProd, _WebSDK_audienceProd, _WebSDK_domain, _WebSDK_audience, _WebSDK_pwaDevUrl, _WebSDK_pwaStagingUrl, _WebSDK_pwaProdUrl, _WebSDK_createRequest, _WebSDK_fetchUserBalances, _WebSDK_fetchUserWallets, _WebSDK_fetchUserInfo, _WebSDK_fetchUserNfts, _WebSDK_getWrappedDek;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginButton = exports.LoginBehavior = exports.SupportedChains = exports.SphereEnvironment = void 0;
const types_1 = require("./src/types");
const oidc_client_ts_1 = require("oidc-client-ts");
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
        _WebSDK_environment.set(this, types_1.Environments.PRODUCTION);
        _WebSDK_oauth2Client.set(this, void 0);
        _WebSDK_wrappedDek.set(this, '');
        _WebSDK_wrappedDekExpiration.set(this, 0);
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
                scope: 'openid offline_access',
                automaticSilentRenew: true,
            }), "f");
            WebSDK.instance = this;
            return WebSDK.instance;
        };
        this.clear = () => {
            this.user = null;
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
                        refreshToken: authResult.refresh_token,
                        expires_at: authResult.expires_at,
                    };
                    if (this.user) {
                        this.user.uid = authResult.profile.sub;
                    }
                    else
                        this.user = { uid: authResult.profile.sub };
                    yield this.getUserInfo();
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
            var _b, _c, _d;
            const persistence = yield ((_b = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _b === void 0 ? void 0 : _b.getUser());
            console.log('persistence', persistence);
            if (persistence) {
                const isExpired = yield this.isTokenExpired();
                if (!isExpired) {
                    console.log('token not expired');
                    this.credentials = {
                        accessToken: persistence.access_token,
                        idToken: persistence.id_token,
                        refreshToken: persistence.refresh_token,
                        expires_at: (_c = persistence.expires_at) !== null && _c !== void 0 ? _c : 0,
                    };
                    if (this.user)
                        this.user.uid = persistence.profile.sub;
                    else
                        this.user = { uid: persistence.profile.sub };
                    yield this.getUserInfo();
                    return persistence;
                }
                else {
                    const refreshed = yield this.refreshToken();
                    console.log('refreshed inside handle persistence', refreshed);
                    if (refreshed) {
                        this.credentials = {
                            accessToken: refreshed.access_token,
                            idToken: refreshed.id_token,
                            refreshToken: refreshed.refresh_token,
                            expires_at: (_d = refreshed.expires_at) !== null && _d !== void 0 ? _d : 0,
                        };
                        if (this.user)
                            this.user.uid = refreshed.profile.sub;
                        else
                            this.user = { uid: refreshed.profile.sub };
                        yield this.getUserInfo();
                        return refreshed;
                    }
                    else {
                        console.log("couldn't refresh token");
                        this.logout();
                        return null;
                    }
                }
            }
            else
                return null;
        });
        this.handleCallback = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('handleCallback');
                const persistence = yield this.handlePersistence();
                console.log('persistence inside handleCallback', persistence);
                if (persistence)
                    return persistence;
                console.log('handleAuth');
                const handleAuth = yield this.handleAuth();
                console.log('handleAuth inside handleCallback', handleAuth);
                return handleAuth;
            }
            catch (error) {
                console.error('There was an error logging in , error: ', error);
                return error;
            }
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g;
            if (this.loginType === types_1.LoginBehavior.REDIRECT) {
                yield ((_e = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _e === void 0 ? void 0 : _e.signinRedirect({
                    extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                }));
            }
            else {
                try {
                    const authResult = yield ((_f = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _f === void 0 ? void 0 : _f.signinPopup({
                        extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                    }));
                    if (authResult) {
                        this.credentials = {
                            accessToken: authResult.access_token,
                            idToken: authResult.id_token,
                            refreshToken: authResult.refresh_token,
                            expires_at: (_g = authResult.expires_at) !== null && _g !== void 0 ? _g : 0,
                        };
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
                    console.error('There was an error logging in , error: ', error);
                    return error;
                }
            }
        });
        this.logout = () => {
            var _a;
            try {
                if (typeof window === 'undefined')
                    return;
                (_a = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _a === void 0 ? void 0 : _a.signoutSilent();
                window.location.replace(this.redirectUri);
                this.clear();
            }
            catch (e) {
                console.log('error logging out', e);
            }
        };
        _WebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            var _h;
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${(_h = this.credentials) === null || _h === void 0 ? void 0 : _h.accessToken}`);
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
        _WebSDK_fetchUserWallets.set(this, (forceRefresh) => __awaiter(this, void 0, void 0, function* () {
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
            if (__classPrivateFieldGet(this, _WebSDK_wrappedDek, "f") && __classPrivateFieldGet(this, _WebSDK_wrappedDekExpiration, "f") > Date.now())
                return __classPrivateFieldGet(this, _WebSDK_wrappedDek, "f");
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST');
                const response = yield fetch(`${this.baseUrl}/createOrRecoverAccount`, requestOptions);
                const data = yield response.json();
                __classPrivateFieldSet(this, _WebSDK_wrappedDek, data.data, "f");
                __classPrivateFieldSet(this, _WebSDK_wrappedDekExpiration, Date.now() + 1000 * 60 * 30, "f");
                return data.data;
            }
            catch (error) {
                console.error('There was an error getting wrapped dek, error: ', error);
                return error;
            }
        }));
        this.createCharge = (charge) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { chargeData: charge }, { 'x-api-key': (_j = this.apiKey) !== null && _j !== void 0 ? _j : '' });
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
            const payFn = () => __awaiter(this, void 0, void 0, function* () {
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
            });
            try {
                yield this.checkTokenAndExecuteFunction(payFn);
            }
            catch (error) {
                console.error('There was an processing your payment, error: ', error);
                return error;
            }
        });
        this.payCharge = (transactionId) => __awaiter(this, void 0, void 0, function* () {
            const payChargeFn = () => __awaiter(this, void 0, void 0, function* () {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { wrappedDek, transactionId });
                const response = yield fetch(`${this.baseUrl}/pay`, requestOptions);
                const data = yield response.json();
                return data;
            });
            try {
                yield this.checkTokenAndExecuteFunction(payChargeFn);
            }
            catch (error) {
                console.error('There was an error paying this transaction, error: ', error);
                return error;
            }
        });
        this.getWallets = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserWallets, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.wallets, forceRefresh); };
        this.getUserInfo = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserInfo, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.info, forceRefresh); };
        this.getBalances = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserBalances, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.balances, forceRefresh); };
        this.getNfts = (forceRefresh) => { var _a; return this.checkTokenAndExecuteFunction(__classPrivateFieldGet(this, _WebSDK_fetchUserNfts, "f"), (_a = this.user) === null || _a === void 0 ? void 0 : _a.nfts, forceRefresh); };
        this.isTokenExpired = () => __awaiter(this, void 0, void 0, function* () {
            var _k, _l;
            console.log('this.credentials inside isTokenExpired', this.credentials);
            if (!this.credentials) {
                const user = yield ((_k = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _k === void 0 ? void 0 : _k.getUser());
                console.log('user inside isTokenExpired', user);
                if (user) {
                    return user.expires_at ? user.expires_at < Math.floor(Date.now() / 1000) : true;
                }
            }
            return ((_l = this.credentials) === null || _l === void 0 ? void 0 : _l.expires_at)
                ? this.credentials.expires_at < Math.floor(Date.now() / 1000)
                : true;
        });
        this.refreshToken = () => __awaiter(this, void 0, void 0, function* () {
            var _m, _o, _p, _q, _r, _s, _t;
            try {
                const user = yield ((_m = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _m === void 0 ? void 0 : _m.getUser());
                console.log('user inside refresh token');
                if (((_o = this.credentials) === null || _o === void 0 ? void 0 : _o.expires_at) &&
                    ((_p = this.credentials) === null || _p === void 0 ? void 0 : _p.expires_at) > Math.floor(Date.now() / 1000)) {
                    console.log('token is not expired');
                    return user;
                }
                if (!((_q = this.credentials) === null || _q === void 0 ? void 0 : _q.refreshToken) && user) {
                    this.credentials = {
                        refreshToken: user === null || user === void 0 ? void 0 : user.refresh_token,
                        accessToken: '',
                        idToken: '',
                        expires_at: 0,
                    };
                }
                if ((_r = this.credentials) === null || _r === void 0 ? void 0 : _r.refreshToken) {
                    console.log("token is expired, let's refresh it");
                    const userRefreshed = yield ((_s = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _s === void 0 ? void 0 : _s.signinSilent());
                    console.log('userRefreshed inside refresh token', userRefreshed);
                    if (userRefreshed) {
                        this.credentials = {
                            accessToken: userRefreshed.access_token,
                            idToken: userRefreshed.id_token,
                            refreshToken: userRefreshed.refresh_token,
                            expires_at: (_t = userRefreshed.expires_at) !== null && _t !== void 0 ? _t : 0,
                        };
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
                else
                    throw new Error('The session is expired, please login again');
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
_WebSDK_environment = new WeakMap(), _WebSDK_oauth2Client = new WeakMap(), _WebSDK_wrappedDek = new WeakMap(), _WebSDK_wrappedDekExpiration = new WeakMap(), _WebSDK_domainDev = new WeakMap(), _WebSDK_audienceDev = new WeakMap(), _WebSDK_domainProd = new WeakMap(), _WebSDK_audienceProd = new WeakMap(), _WebSDK_domain = new WeakMap(), _WebSDK_audience = new WeakMap(), _WebSDK_pwaDevUrl = new WeakMap(), _WebSDK_pwaStagingUrl = new WeakMap(), _WebSDK_pwaProdUrl = new WeakMap(), _WebSDK_createRequest = new WeakMap(), _WebSDK_fetchUserBalances = new WeakMap(), _WebSDK_fetchUserWallets = new WeakMap(), _WebSDK_fetchUserInfo = new WeakMap(), _WebSDK_fetchUserNfts = new WeakMap(), _WebSDK_getWrappedDek = new WeakMap();
WebSDK.instance = undefined;
exports.default = WebSDK;
