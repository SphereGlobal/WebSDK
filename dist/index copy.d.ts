interface WebSDK {
    provider: string;
    clientId?: string;
    redirectUri?: string;
}
declare function webSDK({ provider, clientId, redirectUri }: WebSDK): {
    getUserBalances: () => Promise<void>;
    loginWithAuth0: () => void;
    handleAuth0Callback: () => void;
    showAll: () => void;
};
declare function createIframe(width: number, height: number): HTMLIFrameElement;
export { webSDK, createIframe };
