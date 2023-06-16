import { Credentials, Transaction, User, iWebSDK } from './src/types';
declare class WebSDK implements iWebSDK {
    #private;
    static instance: any;
    clientId?: string;
    redirectUri?: string;
    apiKey?: string;
    user?: User;
    credentials?: Credentials | null;
    constructor({ clientId, redirectUri, apiKey }: iWebSDK);
    handleCallback: () => void;
    login(): void;
    logout(): void;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => Promise<any>;
    payCharge: (transactionId: string) => Promise<any>;
    getWallets: () => Promise<any>;
    getUserInfo: () => Promise<any>;
    getBalances: () => Promise<any>;
    getNfts: () => Promise<any>;
}
declare function createIframe(width: number, height: number): HTMLIFrameElement;
export default WebSDK;
export { createIframe };
