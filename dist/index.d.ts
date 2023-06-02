import { Credentials, User, iWebSDK } from './src/types';
declare class WebSDK implements iWebSDK {
    #private;
    static instance: any;
    providerId: string;
    providerUid?: string;
    clientId?: string;
    redirectUri?: string;
    apiKey?: string;
    user?: User;
    credentials?: Credentials | null;
    auth0Client?: any;
    constructor({ providerId, clientId, redirectUri, apiKey }: iWebSDK);
    handleCallback: () => void;
    login(): void;
    getWallets: () => Promise<any>;
    getUserInfo: () => Promise<any>;
    getBalances: () => Promise<any>;
}
declare function createIframe(width: number, height: number): HTMLIFrameElement;
export default WebSDK;
export { createIframe };
