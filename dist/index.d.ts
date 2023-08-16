import { ChargeReqBody, Credentials, Environments, LoginBehavior, Transaction, User, iWebSDK } from './src/types';
export { Environments as SphereEnvironment } from './src/types';
export { SupportedChains } from './src/types';
export { LoginBehavior } from './src/types';
export { LoginButton } from "./src/components/Button/LoginButton";
declare class WebSDK implements iWebSDK {
    #private;
    static instance: WebSDK | undefined;
    loginType: LoginBehavior;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    apiKey?: string;
    baseUrl?: string;
    user?: User;
    credentials?: Credentials | null;
    setClientId: (clientId: string) => this;
    setClientSecret: (clientSecret: string) => this;
    setRedirectUri: (redirectUri: string) => this;
    setApiKey: (apiKey: string) => this;
    setBaseUrl: (baseUrl: string) => this;
    setEnvironment: (environment?: Environments) => this;
    setLoginType: (loginType?: LoginBehavior) => this;
    build: () => WebSDK | undefined;
    clear: () => void;
    handleAuth: () => Promise<any>;
    handlePersistence: () => Promise<import("oidc-client-ts").User | null>;
    handleCallback: () => Promise<any>;
    login: () => Promise<any>;
    logout: () => void;
    createCharge: (charge: ChargeReqBody) => Promise<any>;
    pay: ({ toAddress, chain, symbol, amount, tokenAddress }: Transaction) => Promise<any>;
    payCharge: (transactionId: string) => Promise<any>;
    getWallets: () => Promise<any>;
    getUserInfo: () => Promise<any>;
    getBalances: () => Promise<any>;
    getNfts: () => Promise<any>;
    createIframe(width: number, height: number): HTMLIFrameElement;
}
export default WebSDK;
