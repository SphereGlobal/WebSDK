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
var _WebSDK__auth0Client, _WebSDK__PROJECT_ID, _WebSDK__domain, _WebSDK__audience, _WebSDK__wrappedDek, _WebSDK__createRequest, _WebSDK__fetchUserBalances, _WebSDK__fetchUserWallets, _WebSDK__fetchUserInfo, _WebSDK__fetchUserNfts, _WebSDK__getWrappedDek;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIframe = void 0;
const auth0_js_1 = __importDefault(require("auth0-js"));
class WebSDK {
    constructor({ clientId, redirectUri, apiKey }) {
        _WebSDK__auth0Client.set(this, void 0);
        _WebSDK__PROJECT_ID.set(this, 'sphereone-testing');
        _WebSDK__domain.set(this, 'dev-4fb2r65g1bnesuyt.us.auth0.com');
        _WebSDK__audience.set(this, 'https://dev-4fb2r65g1bnesuyt.us.auth0.com/api/v2/');
        _WebSDK__wrappedDek.set(this, '');
        this.handleCallback = () => {
            // This checks if there is a previous Auth0 session initialized
            __classPrivateFieldGet(this, _WebSDK__auth0Client, "f").checkSession({}, (err, authResult) => {
                if (err) {
                    // Here falls if there is NO previous session stored
                    __classPrivateFieldGet(this, _WebSDK__auth0Client, "f").parseHash((err, authResult) => {
                        if (err) {
                            // Error handling
                            console.error('Error login:', err);
                        }
                        else if (authResult && authResult.accessToken && authResult.idToken) {
                            // Successfull login
                            this.credentials = {
                                accessToken: authResult.accessToken,
                                idToken: authResult.idToken,
                            };
                            this.user.uid = authResult.idTokenPayload.sub;
                        }
                    });
                }
                else if (authResult) {
                    // Here falls if there is a previous session stored
                    this.credentials = {
                        accessToken: authResult.accessToken,
                        idToken: authResult.idToken,
                    };
                    this.user.uid = authResult.idTokenPayload.sub;
                }
            });
        };
        _WebSDK__createRequest.set(this, (body = {}, method = 'POST', headers = {}) => __awaiter(this, void 0, void 0, function* () {
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
        _WebSDK__fetchUserBalances.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, { refreshCache: true });
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/getFundsAvailable`, requestOptions);
                const data = yield response.json();
                this.user.balances = data.data.balances;
                return data.data.balances;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK__fetchUserWallets.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, {}, 'GET');
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/getWallets`, requestOptions);
                const data = yield response.json();
                this.user.wallets = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK__fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, {}, 'GET');
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/user`, requestOptions);
                const data = yield response.json();
                this.user.info = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK__fetchUserNfts.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, {}, 'GET');
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/getNftsAvailable`, requestOptions);
                const data = yield response.json();
                this.user.nfts = data.data;
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK__getWrappedDek.set(this, () => __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _WebSDK__wrappedDek, "f"))
                return __classPrivateFieldGet(this, _WebSDK__wrappedDek, "f");
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this);
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/createOrRecoverAccount`, requestOptions);
                const data = yield response.json();
                __classPrivateFieldSet(this, _WebSDK__wrappedDek, data.data, "f");
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        this.pay = ({ toAddress, chain, symbol, amount, tokenAddress }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK__getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, {
                    wrappedDek,
                    toAddress,
                    chain,
                    symbol,
                    amount,
                    tokenAddress,
                });
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/pay`, requestOptions);
                const data = yield response.json();
                return data.data;
            }
            catch (error) {
                console.log(error);
            }
        });
        this.payCharge = (transactionId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wrappedDek = yield __classPrivateFieldGet(this, _WebSDK__getWrappedDek, "f").call(this);
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK__createRequest, "f").call(this, { wrappedDek, transactionId });
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/api/pay`, requestOptions);
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
            const wallets = yield __classPrivateFieldGet(this, _WebSDK__fetchUserWallets, "f").call(this);
            return wallets;
        });
        this.getUserInfo = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if ((_c = this.user) === null || _c === void 0 ? void 0 : _c.info)
                return this.user.info;
            const userInfo = yield __classPrivateFieldGet(this, _WebSDK__fetchUserInfo, "f").call(this);
            return userInfo;
        });
        this.getBalances = () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            if ((_d = this.user) === null || _d === void 0 ? void 0 : _d.balances)
                return this.user.balances;
            const balances = yield __classPrivateFieldGet(this, _WebSDK__fetchUserBalances, "f").call(this);
            return balances;
        });
        this.getNfts = () => __awaiter(this, void 0, void 0, function* () {
            var _e;
            if ((_e = this.user) === null || _e === void 0 ? void 0 : _e.nfts)
                return this.user.nfts;
            const nfts = yield __classPrivateFieldGet(this, _WebSDK__fetchUserNfts, "f").call(this);
            return nfts;
        });
        if (WebSDK.instance)
            return WebSDK.instance;
        WebSDK.instance = this;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.apiKey = apiKey;
        this.user = {};
        this.credentials = null;
        __classPrivateFieldSet(this, _WebSDK__auth0Client, new auth0_js_1.default.WebAuth({
            domain: __classPrivateFieldGet(this, _WebSDK__domain, "f"),
            clientID: this.clientId,
            redirectUri: this.redirectUri,
            audience: __classPrivateFieldGet(this, _WebSDK__audience, "f"),
            responseType: 'token id_token',
        }), "f");
    }
    login() {
        __classPrivateFieldGet(this, _WebSDK__auth0Client, "f").authorize();
    }
    logout() {
        __classPrivateFieldGet(this, _WebSDK__auth0Client, "f").logout({
            redirectUri: this.redirectUri,
        });
    }
}
_WebSDK__auth0Client = new WeakMap(), _WebSDK__PROJECT_ID = new WeakMap(), _WebSDK__domain = new WeakMap(), _WebSDK__audience = new WeakMap(), _WebSDK__wrappedDek = new WeakMap(), _WebSDK__createRequest = new WeakMap(), _WebSDK__fetchUserBalances = new WeakMap(), _WebSDK__fetchUserWallets = new WeakMap(), _WebSDK__fetchUserInfo = new WeakMap(), _WebSDK__fetchUserNfts = new WeakMap(), _WebSDK__getWrappedDek = new WeakMap();
function createIframe(width, height) {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://<PWA_URL>/';
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
}
exports.createIframe = createIframe;
exports.default = WebSDK;
