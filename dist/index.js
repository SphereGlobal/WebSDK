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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _WebSDK_auth0Client, _WebSDK_wrappedDek, _WebSDK_domain, _WebSDK_audience, _WebSDK_baseUrl, _WebSDK_createRequest, _WebSDK_fetchUserBalances, _WebSDK_fetchUserWallets, _WebSDK_fetchUserInfo, _WebSDK_fetchUserNfts, _WebSDK_getWrappedDek;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIframe = void 0;
const auth0_js_1 = __importDefault(require("auth0-js"));
class WebSDK {
    constructor({ clientId, redirectUri, loginType, apiKey }) {
        this.loginType = 'REDIRECT';
        _WebSDK_auth0Client.set(this, void 0);
        _WebSDK_wrappedDek.set(this, '');
        _WebSDK_domain.set(this, 'dev-4fb2r65g1bnesuyt.us.auth0.com');
        _WebSDK_audience.set(this, 'https://dev-4fb2r65g1bnesuyt.us.auth0.com/api/v2/');
        _WebSDK_baseUrl.set(this, 'https://api-g2eggt3ika-uc.a.run.app');
        this.handleAuth = () => __awaiter(this, void 0, void 0, function* () {
            const authResult = yield new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").parseHash((err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            });
            if (authResult) {
                this.credentials = {
                    accessToken: authResult.accessToken,
                    idToken: authResult.idToken,
                };
                if (this.user)
                    this.user.uid = authResult.idTokenPayload.sub;
                return authResult;
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
                console.log(error);
            }
            finally {
                if (this.loginType === 'POPUP')
                    __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").popup.callback({ hash: window.location.hash });
            }
        });
        this.handlePersistence = () => __awaiter(this, void 0, void 0, function* () {
            const persistance = yield new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").checkSession({}, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            });
            if (persistance) {
                this.credentials = {
                    accessToken: persistance.accessToken,
                    idToken: persistance.idToken,
                };
                if (this.user)
                    this.user.uid = persistance.idTokenPayload.sub;
                return persistance;
            }
            else
                return null;
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            if (this.loginType === 'REDIRECT') {
                __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").authorize();
            }
            else {
                yield new Promise((resolve, reject) => {
                    __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").popup.authorize({
                        domain: __classPrivateFieldGet(this, _WebSDK_domain, "f"),
                        redirectUri: this.redirectUri,
                        responseType: 'token id_token',
                    }, (err, authResult) => __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            reject(err);
                        else {
                            this.credentials = {
                                accessToken: authResult.accessToken,
                                idToken: authResult.idToken,
                            };
                            resolve(authResult);
                        }
                    }));
                });
            }
        });
        this.logout = () => {
            __classPrivateFieldGet(this, _WebSDK_auth0Client, "f").logout({
                redirectUri: this.redirectUri,
                returnTo: this.redirectUri,
            });
        };
        _WebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${(_a = this.credentials) === null || _a === void 0 ? void 0 : _a.accessToken}`);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/getFundsAvailable?refreshCache=true`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.balances = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK_fetchUserWallets.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/user/wallets`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.wallets = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK_fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/user`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.info = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK_fetchUserNfts.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this);
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/getNftsAvailable`, requestOptions);
                const data = yield response.json();
                if (this.user)
                    this.user.nfts = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK_getWrappedDek.set(this, () => __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _WebSDK_wrappedDek, "f"))
                return __classPrivateFieldGet(this, _WebSDK_wrappedDek, "f");
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST');
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/createOrRecoverAccount`, requestOptions);
                const data = yield response.json();
                __classPrivateFieldSet(this, _WebSDK_wrappedDek, data.data, "f");
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/pay`, requestOptions);
                const data = yield response.json();
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        });
        this.payCharge = (transactionId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK_getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { wrappedDek, transactionId });
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/pay`, requestOptions);
                const data = yield response.json();
                return data.result.data;
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getWallets = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if ((_b = this.user) === null || _b === void 0 ? void 0 : _b.wallets)
                return this.user.wallets;
            const wallets = yield __classPrivateFieldGet(this, _WebSDK_fetchUserWallets, "f").call(this);
            return wallets;
        });
        this.getUserInfo = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if ((_c = this.user) === null || _c === void 0 ? void 0 : _c.info)
                return this.user.info;
            const userInfo = yield __classPrivateFieldGet(this, _WebSDK_fetchUserInfo, "f").call(this);
            return userInfo;
        });
        this.getBalances = () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            if ((_d = this.user) === null || _d === void 0 ? void 0 : _d.balances)
                return this.user.balances;
            const balances = yield __classPrivateFieldGet(this, _WebSDK_fetchUserBalances, "f").call(this);
            return balances;
        });
        this.getNfts = () => __awaiter(this, void 0, void 0, function* () {
            var _e;
            if ((_e = this.user) === null || _e === void 0 ? void 0 : _e.nfts)
                return this.user.nfts;
            const nfts = yield __classPrivateFieldGet(this, _WebSDK_fetchUserNfts, "f").call(this);
            return nfts;
        });
        if (WebSDK.instance)
            return WebSDK.instance;
        WebSDK.instance = this;
        this.loginType = loginType || 'REDIRECT';
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.apiKey = apiKey;
        this.user = {};
        this.credentials = null;
        __classPrivateFieldSet(this, _WebSDK_auth0Client, new auth0_js_1.default.WebAuth({
            domain: __classPrivateFieldGet(this, _WebSDK_domain, "f"),
            clientID: this.clientId,
            redirectUri: this.redirectUri,
            audience: __classPrivateFieldGet(this, _WebSDK_audience, "f"),
            responseType: 'token id_token',
        }), "f");
    }
}
_WebSDK_auth0Client = new WeakMap(), _WebSDK_wrappedDek = new WeakMap(), _WebSDK_domain = new WeakMap(), _WebSDK_audience = new WeakMap(), _WebSDK_baseUrl = new WeakMap(), _WebSDK_createRequest = new WeakMap(), _WebSDK_fetchUserBalances = new WeakMap(), _WebSDK_fetchUserWallets = new WeakMap(), _WebSDK_fetchUserInfo = new WeakMap(), _WebSDK_fetchUserNfts = new WeakMap(), _WebSDK_getWrappedDek = new WeakMap();
function createIframe(width, height) {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://wallet.sphereone.xyz/';
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
}
exports.createIframe = createIframe;
exports.default = WebSDK;
