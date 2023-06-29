import auth0 from 'auth0-js';
import { Credentials, Transaction, User, iWebSDK } from './src/types';
declare class WebSDK implements iWebSDK {
    #private;
    static instance: any;
    loginType: 'REDIRECT' | 'POPUP';
    clientId?: string;
    redirectUri?: string;
    apiKey?: string;
    baseUrl?: string;
    user?: User;
    credentials?: Credentials | null;
    constructor({ clientId, redirectUri, baseUrl, loginType, apiKey }: iWebSDK);
    handleAuth: () => Promise<auth0.Auth0DecodedHash | null>;
    handleCallback: () => Promise<unknown>;
    handlePersistence: () => Promise<auth0.Auth0DecodedHash | null>;
    login: () => Promise<void>;
    logout: () => void;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => Promise<any>;
    payCharge: (transactionId: string) => Promise<any>;
    getWallets: () => Promise<any>;
    getUserInfo: () => Promise<any>;
    getBalances: () => Promise<any>;
    getNfts: () => Promise<any>;
    setEnvironmet: (env: string) => void;
    createIframe(width: number, height: number): HTMLIFrameElement;
}
export default WebSDK;
