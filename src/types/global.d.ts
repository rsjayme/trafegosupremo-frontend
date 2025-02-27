import { FacebookSDK } from './facebook';

declare global {
    interface Window {
        FB: FacebookSDK;
        fbAsyncInit: () => void;
    }
}

export { };