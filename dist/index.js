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
var _WebSDK_instances, _WebSDK_credentials, _WebSDK_oauth2Client, _WebSDK_wrappedDek, _WebSDK_wrappedDekExpiration, _WebSDK_domain, _WebSDK_audience, _WebSDK_pwaProdUrl, _WebSDK_baseUrl, _WebSDK_pinCodeUrl, _WebSDK_loadCredentials, _WebSDK_handleAuth, _WebSDK_handlePersistence, _WebSDK_createRequest, _WebSDK_fetchUserBalances, _WebSDK_fetchUserWallets, _WebSDK_fetchUserInfo, _WebSDK_fetchUserNfts, _WebSDK_getWrappedDek, _WebSDK_fetchTransactions, _WebSDK_estimateRoute, _WebSDK_refreshToken, _WebSDK_getData, _WebSDK_loadUserData;
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
    constructor(clientId, redirectUri, apiKey, loginType = types_1.LoginBehavior.REDIRECT) {
        _WebSDK_instances.add(this);
        this.user = null;
        this.loginType = types_1.LoginBehavior.REDIRECT;
        _WebSDK_credentials.set(this, null);
        _WebSDK_oauth2Client.set(this, void 0);
        _WebSDK_wrappedDek.set(this, '');
        _WebSDK_wrappedDekExpiration.set(this, 0);
        _WebSDK_domain.set(this, 'https://auth.sphereone.xyz');
        _WebSDK_audience.set(this, 'https://auth.sphereone.xyz');
        _WebSDK_pwaProdUrl.set(this, 'https://wallet.sphereone.xyz');
        _WebSDK_baseUrl.set(this, 'https://api-olgsdff53q-uc.a.run.app');
        _WebSDK_pinCodeUrl.set(this, 'https://sphereone-pincode.web.app');
        this.scope = 'openid email offline_access profile';
        this.pinCodeScreen = null;
        this.getAccessToken = () => {
            var _a, _b;
            return (_b = (_a = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _a === void 0 ? void 0 : _a.accessToken) !== null && _b !== void 0 ? _b : '';
        };
        this.getIdToken = () => {
            var _a, _b;
            return (_b = (_a = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _a === void 0 ? void 0 : _a.idToken) !== null && _b !== void 0 ? _b : '';
        };
        this.clear = () => {
            this.user = null;
            __classPrivateFieldSet(this, _WebSDK_credentials, null, "f");
            __classPrivateFieldSet(this, _WebSDK_wrappedDek, '', "f");
        };
        _WebSDK_handleAuth.set(this, (url) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // if url is undefined (default behavior) it will take the url from window.location.href
                const authResult = yield ((_a = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _a === void 0 ? void 0 : _a.signinCallback(url));
                if (authResult) {
                    __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, authResult);
                    if (this.user) {
                        this.user.uid = (_b = authResult.profile) === null || _b === void 0 ? void 0 : _b.sub;
                    }
                    else
                        this.user = { uid: (_c = authResult.profile) === null || _c === void 0 ? void 0 : _c.sub };
                    // Load information in state
                    __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadUserData).call(this);
                    return authResult;
                }
                else
                    return null;
            }
            catch (error) {
                // this happens because it tries a login although there is no session/user
                // this piece of code is used with the login.Redirect
                if (error.message.includes('state')) {
                    return null;
                }
                throw new Error(error.message || JSON.stringify(error));
            }
        }));
        _WebSDK_handlePersistence.set(this, () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const persistence = yield ((_d = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _d === void 0 ? void 0 : _d.getUser());
            if (persistence) {
                const isExpired = yield this.isTokenExpired();
                if (!isExpired) {
                    __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, persistence);
                    if (this.user)
                        this.user.uid = persistence.profile.sub;
                    else
                        this.user = { uid: persistence.profile.sub };
                    // Load information in state
                    __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadUserData).call(this);
                    return persistence;
                }
                else {
                    const refreshed = yield __classPrivateFieldGet(this, _WebSDK_refreshToken, "f").call(this);
                    if (refreshed) {
                        __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, refreshed);
                        if (this.user)
                            this.user.uid = refreshed.profile.sub;
                        else
                            this.user = { uid: refreshed.profile.sub };
                        // Load information in state
                        __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadUserData).call(this);
                        return refreshed;
                    }
                    else {
                        return null;
                    }
                }
            }
            else
                return null;
        }));
        this.handleCallback = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const persistence = yield __classPrivateFieldGet(this, _WebSDK_handlePersistence, "f").call(this);
                if (persistence)
                    return Object.assign(Object.assign({}, persistence), { refresh_token: null });
                const handleAuth = yield __classPrivateFieldGet(this, _WebSDK_handleAuth, "f").call(this, url);
                if (handleAuth)
                    return Object.assign(Object.assign({}, handleAuth), { refresh_token: null });
                else
                    return null;
            }
            catch (error) {
                console.error('There was an error login, error: ', error);
                return error;
            }
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            var _e, _f;
            yield this.logout(false);
            if (this.loginType === types_1.LoginBehavior.REDIRECT) {
                yield ((_e = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _e === void 0 ? void 0 : _e.signinRedirect({
                    extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                    scope: this.scope,
                }));
            }
            else {
                try {
                    const authResult = yield ((_f = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _f === void 0 ? void 0 : _f.signinPopup({
                        extraQueryParams: { audience: __classPrivateFieldGet(this, _WebSDK_audience, "f") },
                        scope: this.scope,
                    }));
                    if (authResult) {
                        __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, authResult);
                        if (this.user)
                            this.user.uid = authResult.profile.sub;
                        else
                            this.user = { uid: authResult.profile.sub };
                        // Load information in state
                        __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadUserData).call(this);
                        return Object.assign(Object.assign({}, authResult), { refresh_token: null });
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
        this.logout = (withPageReload = true) => __awaiter(this, void 0, void 0, function* () {
            var _g, _h;
            try {
                if (typeof window === 'undefined')
                    return;
                (_g = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _g === void 0 ? void 0 : _g.signoutSilent();
                (_h = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _h === void 0 ? void 0 : _h.removeUser();
                withPageReload && window.location.replace(this.redirectUri);
                this.clear();
            }
            catch (e) {
                console.error('error logging out', e);
            }
        });
        _WebSDK_createRequest.set(this, (method = 'GET', body = {}, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            // check if access token is valid or can be refresh
            if (yield this.isTokenExpired()) {
                const refreshToken = yield __classPrivateFieldGet(this, _WebSDK_refreshToken, "f").call(this);
                if (!refreshToken)
                    throw new Error('The user is not login or the session is expired, please login again');
            }
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${(_j = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _j === void 0 ? void 0 : _j.accessToken}`);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/user/wallets`, requestOptions);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/user`, requestOptions);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/getNftsAvailable`, requestOptions);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/createOrRecoverAccount`, requestOptions);
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
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/transactions`, requestOptions);
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
        _WebSDK_estimateRoute.set(this, ({ transactionId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { transactionId });
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/pay/route`, requestOptions);
                const data = (yield response.json());
                return data;
            }
            catch (e) {
                // more for internal server errors or bad requests
                console.error(`There was an error estimating the route for charge ${transactionId} because: ${e}`);
                throw new Error(e.message || e);
            }
        }));
        this.createCharge = ({ chargeData, isDirectTransfer = false, isTest = false, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                // this endpoint doesn't need to have an a valid access token as header
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/createCharge`, {
                    headers: { 'x-api-key': this.apiKey, 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        chargeData,
                        isDirectTransfer,
                        isTest,
                    }),
                });
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
        this.payCharge = (transactionId, DEK = __classPrivateFieldGet(this, _WebSDK_wrappedDek, "f")) => __awaiter(this, void 0, void 0, function* () {
            var _k, _l, _m, _o, _p;
            try {
                if (!DEK)
                    throw new Error('There was an error getting the wrapped dek');
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { wrappedDek: DEK, transactionId });
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/pay`, requestOptions);
                const res = yield response.json();
                if (res.error) {
                    const onRampResponse = res;
                    if (((_k = onRampResponse.error) === null || _k === void 0 ? void 0 : _k.code) === 'empty-balances' ||
                        ((_l = onRampResponse.error) === null || _l === void 0 ? void 0 : _l.code) === 'insufficient-balances' ||
                        ((_o = (_m = onRampResponse.error) === null || _m === void 0 ? void 0 : _m.message) === null || _o === void 0 ? void 0 : _o.includes('Not sufficient funds to bridge'))) {
                        const onrampLink = (_p = onRampResponse.data) === null || _p === void 0 ? void 0 : _p.onrampLink;
                        throw new types_1.PayError({
                            message: 'insufficient balances',
                            onrampLink: onrampLink,
                        });
                    }
                    else {
                        const errorResponse = res;
                        throw new Error(`Payment failed: ${typeof errorResponse.error === 'string'
                            ? errorResponse.error
                            : errorResponse.error.message || errorResponse.error.code}`);
                    }
                }
                else {
                    const payResponse = res.data;
                    return Object.assign({}, payResponse);
                }
            }
            catch (error) {
                console.error('There was an error paying this transaction, error: ', error);
                if (error instanceof types_1.PayError) {
                    throw error;
                }
                else
                    throw new Error(error);
            }
        });
        this.getWallets = ({ forceRefresh } = { forceRefresh: false }) => __awaiter(this, void 0, void 0, function* () { var _q; return __classPrivateFieldGet(this, _WebSDK_getData, "f").call(this, __classPrivateFieldGet(this, _WebSDK_fetchUserWallets, "f"), (_q = this.user) === null || _q === void 0 ? void 0 : _q.wallets, forceRefresh); });
        this.getUserInfo = ({ forceRefresh } = { forceRefresh: false }) => __awaiter(this, void 0, void 0, function* () { var _r; return __classPrivateFieldGet(this, _WebSDK_getData, "f").call(this, __classPrivateFieldGet(this, _WebSDK_fetchUserInfo, "f"), (_r = this.user) === null || _r === void 0 ? void 0 : _r.info, forceRefresh); });
        this.getBalances = ({ forceRefresh } = { forceRefresh: false }) => __awaiter(this, void 0, void 0, function* () { var _s; return __classPrivateFieldGet(this, _WebSDK_getData, "f").call(this, __classPrivateFieldGet(this, _WebSDK_fetchUserBalances, "f"), (_s = this.user) === null || _s === void 0 ? void 0 : _s.balances, forceRefresh); });
        this.getNfts = ({ forceRefresh } = { forceRefresh: false }) => __awaiter(this, void 0, void 0, function* () { var _t; return __classPrivateFieldGet(this, _WebSDK_getData, "f").call(this, __classPrivateFieldGet(this, _WebSDK_fetchUserNfts, "f"), (_t = this.user) === null || _t === void 0 ? void 0 : _t.nfts, forceRefresh); });
        this.getTransactions = (props = {
            quantity: 0,
            getReceived: true,
            getSent: true,
            forceRefresh: false,
        }) => __awaiter(this, void 0, void 0, function* () {
            var _u;
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
            if (!getSent && !getReceived)
                throw new Error('getSent and getReceived cannot be both false');
            const encoded = yield __classPrivateFieldGet(this, _WebSDK_getData, "f").call(this, __classPrivateFieldGet(this, _WebSDK_fetchTransactions, "f"), (_u = this.user) === null || _u === void 0 ? void 0 : _u.transactions, forceRefresh);
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
        this.getRouteEstimation = ({ transactionId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield __classPrivateFieldGet(this, _WebSDK_estimateRoute, "f").call(this, { transactionId });
                if (response.error) {
                    const error = response.error;
                    if (error.code === 'empty-balances' || error.code === 'insufficient-balances') {
                        const data = response.data;
                        const onrampLink = data.onrampLink;
                        throw new types_1.RouteEstimateError({
                            message: error.code,
                            onrampLink: onrampLink,
                        });
                    }
                    else {
                        throw new Error(`Error: ${error.code}: ${error.message}`);
                    }
                }
                else {
                    return response.data;
                }
            }
            catch (e) {
                // returning internal server errors and catching response error handling
                if (e instanceof types_1.RouteEstimateError)
                    throw e;
                else
                    throw new Error(e.message || e);
            }
        });
        this.isTokenExpired = () => __awaiter(this, void 0, void 0, function* () {
            var _v, _w;
            if (!__classPrivateFieldGet(this, _WebSDK_credentials, "f")) {
                const user = yield ((_v = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _v === void 0 ? void 0 : _v.getUser());
                if (user) {
                    return user.expires_at ? user.expires_at < Math.floor(Date.now() / 1000) : true;
                }
                else
                    return true;
            }
            return ((_w = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _w === void 0 ? void 0 : _w.expires_at)
                ? __classPrivateFieldGet(this, _WebSDK_credentials, "f").expires_at < Math.floor(Date.now() / 1000)
                : true;
        });
        _WebSDK_refreshToken.set(this, () => __awaiter(this, void 0, void 0, function* () {
            var _x, _y, _z, _0, _1, _2;
            try {
                const user = yield ((_x = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _x === void 0 ? void 0 : _x.getUser());
                if (((_y = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _y === void 0 ? void 0 : _y.expires_at) &&
                    ((_z = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _z === void 0 ? void 0 : _z.expires_at) > Math.floor(Date.now() / 1000)) {
                    return user;
                }
                if (!((_0 = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _0 === void 0 ? void 0 : _0.refreshToken) && user) {
                    __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, user);
                }
                if ((_1 = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _1 === void 0 ? void 0 : _1.refreshToken) {
                    const userRefreshed = yield ((_2 = __classPrivateFieldGet(this, _WebSDK_oauth2Client, "f")) === null || _2 === void 0 ? void 0 : _2.signinSilent());
                    if (userRefreshed) {
                        __classPrivateFieldGet(this, _WebSDK_instances, "m", _WebSDK_loadCredentials).call(this, userRefreshed);
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
        }));
        _WebSDK_getData.set(this, (fn, property, forceRefresh = true) => {
            if (property && !forceRefresh)
                return property;
            else
                return fn();
        });
        this.addWallet = ({ walletAddress, chains, label, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!walletAddress || !chains)
                    throw new Error('Missing parameters, walletAddress and chains should be added');
                const requestOptions = yield __classPrivateFieldGet(this, _WebSDK_createRequest, "f").call(this, 'POST', { walletAddress, chains, label }, {
                    'x-api-key': this.apiKey,
                });
                const response = yield fetch(`${__classPrivateFieldGet(this, _WebSDK_baseUrl, "f")}/addWallet`, requestOptions);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('There was an error adding a wallet, error: ', error);
                throw new Error(error.message || error);
            }
        });
        this.setDek = (DEK) => {
            __classPrivateFieldSet(this, _WebSDK_wrappedDek, DEK, "f");
        };
        this.addPinCode = () => {
            var _a;
            const width = 450;
            const height = 350;
            const left = (window.innerWidth - width) / 2 + window.screenX;
            const top = (window.innerHeight - height) / 2 + window.screenY;
            const options = `width=${width},height=${height},left=${left},top=${top}`;
            this.pinCodeScreen = window.open(`${__classPrivateFieldGet(this, _WebSDK_pinCodeUrl, "f")}/add?accessToken=${(_a = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _a === void 0 ? void 0 : _a.accessToken}`, 'Add Pin Code', options);
        };
        this.openPinCode = (chargeId) => {
            var _a;
            const width = 450;
            const height = 350;
            const left = (window.innerWidth - width) / 2 + window.screenX;
            const top = (window.innerHeight - height) / 2 + window.screenY;
            const options = `width=${width},height=${height},left=${left},top=${top}`;
            this.pinCodeScreen = window.open(`${__classPrivateFieldGet(this, _WebSDK_pinCodeUrl, "f")}/?accessToken=${(_a = __classPrivateFieldGet(this, _WebSDK_credentials, "f")) === null || _a === void 0 ? void 0 : _a.accessToken}&chargeId=${chargeId}`, 'Sphereone Pin Code', options);
        };
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.apiKey = apiKey;
        this.loginType = loginType;
        __classPrivateFieldSet(this, _WebSDK_oauth2Client, new oidc_client_ts_1.UserManager({
            authority: __classPrivateFieldGet(this, _WebSDK_domain, "f"),
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            post_logout_redirect_uri: this.redirectUri,
            userStore: typeof window !== 'undefined'
                ? new oidc_client_ts_1.WebStorageStateStore({ store: window.localStorage })
                : undefined,
            scope: this.scope,
            automaticSilentRenew: true,
        }), "f");
    }
    createIframe(width, height) {
        const iframe = document.createElement('iframe');
        iframe.src = __classPrivateFieldGet(this, _WebSDK_pwaProdUrl, "f");
        iframe.width = width.toString();
        iframe.height = height.toString();
        return iframe;
    }
}
_WebSDK_credentials = new WeakMap(), _WebSDK_oauth2Client = new WeakMap(), _WebSDK_wrappedDek = new WeakMap(), _WebSDK_wrappedDekExpiration = new WeakMap(), _WebSDK_domain = new WeakMap(), _WebSDK_audience = new WeakMap(), _WebSDK_pwaProdUrl = new WeakMap(), _WebSDK_baseUrl = new WeakMap(), _WebSDK_pinCodeUrl = new WeakMap(), _WebSDK_handleAuth = new WeakMap(), _WebSDK_handlePersistence = new WeakMap(), _WebSDK_createRequest = new WeakMap(), _WebSDK_fetchUserBalances = new WeakMap(), _WebSDK_fetchUserWallets = new WeakMap(), _WebSDK_fetchUserInfo = new WeakMap(), _WebSDK_fetchUserNfts = new WeakMap(), _WebSDK_getWrappedDek = new WeakMap(), _WebSDK_fetchTransactions = new WeakMap(), _WebSDK_estimateRoute = new WeakMap(), _WebSDK_refreshToken = new WeakMap(), _WebSDK_getData = new WeakMap(), _WebSDK_instances = new WeakSet(), _WebSDK_loadCredentials = function _WebSDK_loadCredentials({ access_token, id_token, refresh_token, expires_at }) {
    __classPrivateFieldSet(this, _WebSDK_credentials, {
        accessToken: access_token,
        idToken: id_token !== null && id_token !== void 0 ? id_token : '',
        refreshToken: refresh_token,
        expires_at: expires_at !== null && expires_at !== void 0 ? expires_at : 0,
    }, "f");
}, _WebSDK_loadUserData = function _WebSDK_loadUserData() {
    this.getUserInfo();
    this.getTransactions();
    this.getNfts();
    this.getBalances();
    this.getWallets();
};
exports.default = WebSDK;
