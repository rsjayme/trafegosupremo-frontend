"use client";

import { useEffect } from "react";
import Script from "next/script";
import { FacebookSDK } from "@/types/facebook";

declare global {
    interface Window {
        FB: FacebookSDK;
        fbAsyncInit: () => void;
    }
}

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

if (!FACEBOOK_APP_ID) {
    throw new Error(
        "NEXT_PUBLIC_FACEBOOK_APP_ID é obrigatório para inicializar o SDK do Facebook"
    );
}

export function FacebookSDKProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Inicializa o SDK do Facebook
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_APP_ID as string,
                cookie: true,
                xfbml: true,
                version: "v19.0",
            });
        };
    }, []);

    return (
        <>
            <Script
                id="facebook-jssdk"
                strategy="lazyOnload"
                src="https://connect.facebook.net/pt_BR/sdk.js"
                async
                defer
                crossOrigin="anonymous"
            />
            {children}
        </>
    );
}