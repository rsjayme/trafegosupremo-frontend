import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { LoadingContainer } from "@/components/LoadingOverlay";
import { FacebookSDKProvider } from "@/components/FacebookSDKProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Traffic Genius",
  description: "O canivete suíço do gestor de tráfego",
};

// Desativa a geração estática para páginas que precisam de dados dinâmicos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <FacebookSDKProvider>
            <LoadingContainer isLoading={false}>
              <main className="min-h-screen bg-gray-50">
                {children}
              </main>
            </LoadingContainer>
          </FacebookSDKProvider>
          <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            toastOptions={{
              style: { fontSize: '0.875rem' },
              className: 'font-medium',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
