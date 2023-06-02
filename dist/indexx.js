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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIframe = exports.webSDK = void 0;
const auth0_js_1 = __importDefault(require("auth0-js"));
function webSDK({ provider, clientId, redirectUri }) {
    let providerId = provider;
    let providerUid;
    let apiKey = '6cb31c56-82cf-439a-ba8c-304fbddb0a26';
    let user = null;
    let credentials = null;
    let balances = null;
    let myState = {
        data: null,
        isLoading: false,
        error: null,
    };
    const PROJECT_ID = 'sphereone-testing';
    const auth0Client = new auth0_js_1.default.WebAuth({
        domain: 'dev-7mz527mzl0k6ccnp.us.auth0.com',
        clientID: '5OrSHrL1HA50tVtwuECT9utDfqFFlt69',
        redirectUri: 'http://localhost:3000',
        responseType: 'token id_token',
    });
    function showAll() {
        console.log({ credentials, user, balances, myState });
    }
    function handleAuth0Callback() {
        auth0Client.parseHash((err, authResult) => {
            if (err) {
                console.error('Error login:', err);
            }
            else if (authResult && authResult.accessToken && authResult.idToken) {
                console.log('AccessToken:', authResult.accessToken);
                console.log('IDToken:', authResult.idToken);
                console.log(authResult);
                user = {
                    email: authResult.idTokenPayload.email,
                    name: authResult.idTokenPayload.name,
                    nickname: authResult.idTokenPayload.nickname,
                };
                credentials = {
                    accessToken: authResult.accessToken,
                    idToken: authResult.idToken,
                };
                providerUid = authResult.idTokenPayload.sub;
            }
        });
    }
    function loginWithAuth0() {
        auth0Client.authorize({
            domain: 'dev-7mz527mzl0k6ccnp.us.auth0.com',
            responseType: 'token id_token',
        });
    }
    function getUserBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                myState.isLoading = true;
                myState.error = null;
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                const raw = JSON.stringify({
                    data: {
                        providerId,
                        providerUid,
                        refreshCache: false,
                    },
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'manual',
                };
                const response = yield fetch(`https://us-central1-${PROJECT_ID}.cloudfunctions.net/getFundsAvailable`, requestOptions);
                console.log({ credentials, user, balances });
                const data = yield response.json();
                balances = data;
                console.log(data);
                myState.data = data;
                myState.isLoading = false;
            }
            catch (error) {
                myState.isLoading = false;
                myState.error = error;
            }
            // return data.result.data;
        });
    }
    // async function getUserWallets() {
    //   const myHeaders = new Headers();
    //   myHeaders.append('Content-Type', 'application/json');
    //   const raw = JSON.stringify({
    //     providerId,
    //     providerUserUid: providerUid,
    //     apiKey,
    //   });
    //   const requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     // redirect: 'follow' as RequestRedirect,
    //   };
    //   const response = await fetch(
    //     `https://us-central1-${PROJECT_ID}.cloudfunctions.net/user`,
    //     requestOptions
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   return data;
    // }
    return {
        getUserBalances,
        loginWithAuth0,
        handleAuth0Callback,
        showAll,
        // getUserWallets,
    };
}
exports.webSDK = webSDK;
function createIframe(width, height) {
    const iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:19006/';
    iframe.width = width.toString();
    iframe.height = height.toString();
    return iframe;
}
exports.createIframe = createIframe;
