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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _WebSDK__PROJECT_ID, _WebSDK__domain, _WebSDK__fetchUserBalances, _WebSDK__fetchUserInfo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIframe = void 0;
const auth0_js_1 = __importDefault(require("auth0-js"));
class WebSDK {
    constructor({ providerId, clientId, redirectUri, apiKey }) {
        this.providerId = '';
        _WebSDK__PROJECT_ID.set(this, 'sphereone-testing');
        _WebSDK__domain.set(this, 'dev-7mz527mzl0k6ccnp.us.auth0.com');
        this.handleCallback = () => {
            if (this.auth0Client && !this.providerUid) {
                this.auth0Client.parseHash((err, authResult) => {
                    if (err) {
                        console.error('Error login:', err);
                    }
                    else if (authResult && authResult.accessToken && authResult.idToken) {
                        this.credentials = {
                            accessToken: authResult.accessToken,
                            idToken: authResult.idToken,
                        };
                        this.providerUid = authResult.idTokenPayload.sub;
                    }
                });
            }
        };
        _WebSDK__fetchUserBalances.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                const raw = JSON.stringify({
                    data: {
                        providerId: this.providerId,
                        providerUid: this.providerUid,
                        refreshCache: false,
                    },
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/getFundsAvailable`, requestOptions);
                const data = yield response.json();
                this.user.balances = data.result.data.balances;
                return data.result.data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        _WebSDK__fetchUserInfo.set(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                const raw = JSON.stringify({
                    providerId: this.providerId,
                    providerUserUid: this.providerUid,
                    apiKey: this.apiKey,
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };
                const response = yield fetch(`https://us-central1-${__classPrivateFieldGet(this, _WebSDK__PROJECT_ID, "f")}.cloudfunctions.net/user`, requestOptions);
                const data = yield response.json();
                this.user.info = data.data.userInfo;
                this.user.wallets = data.data.wallets;
                return data;
            }
            catch (error) {
                console.log(error);
            }
        }));
        this.getWallets = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.wallets)
                return this.user.wallets;
            const wallets = yield __classPrivateFieldGet(this, _WebSDK__fetchUserInfo, "f").call(this);
            return wallets.data.wallets;
        });
        this.getUserInfo = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if ((_b = this.user) === null || _b === void 0 ? void 0 : _b.info)
                return this.user.info;
            const userInfo = yield __classPrivateFieldGet(this, _WebSDK__fetchUserInfo, "f").call(this);
            return userInfo.data.userInfo;
        });
        this.getBalances = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if ((_c = this.user) === null || _c === void 0 ? void 0 : _c.balances)
                return this.user.balances;
            const balances = yield __classPrivateFieldGet(this, _WebSDK__fetchUserBalances, "f").call(this);
            return balances;
        });
        if (WebSDK.instance)
            return WebSDK.instance;
        WebSDK.instance = this;
        this.providerId = providerId;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.apiKey = apiKey;
        this.providerUid = '';
        this.user = {};
        this.credentials = null;
        this.auth0Client = new auth0_js_1.default.WebAuth({
            domain: __classPrivateFieldGet(this, _WebSDK__domain, "f"),
            clientID: this.clientId,
            redirectUri: this.redirectUri,
            responseType: 'token id_token',
        });
    }
    login() {
        this.auth0Client.authorize({
            domain: __classPrivateFieldGet(this, _WebSDK__domain, "f"),
            responseType: 'token id_token',
        });
    }
}
_WebSDK__PROJECT_ID = new WeakMap(), _WebSDK__domain = new WeakMap(), _WebSDK__fetchUserBalances = new WeakMap(), _WebSDK__fetchUserInfo = new WeakMap();
function createIframe(width, height) {
    const iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:19006/';
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
}
exports.createIframe = createIframe;
exports.default = WebSDK;
