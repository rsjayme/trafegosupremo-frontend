"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { brandsService } from "@/services/brands";

interface Account {
    id: string;
    name: string;
    accountId: string;
}

interface AccountContextType {
    selectedAccount: Account | null;
    setSelectedAccount: (account: Account | null) => void;
    accounts: Account[];
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        async function loadAccounts() {
            try {
                const brands = await brandsService.listBrands();
                const allAccounts: Account[] = [];

                brands.forEach(brand => {
                    brand.facebookAdAccounts.forEach(account => {
                        allAccounts.push({
                            id: account.id.toString(),
                            accountId: account.accountId,
                            name: account.name
                        });
                    });
                });

                // Ordenar contas se existirem
                if (allAccounts.length > 0) {
                    allAccounts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    // Seleciona primeira conta apenas se não houver uma selecionada
                    if (!selectedAccount) {
                        setSelectedAccount(allAccounts[0]);
                    }
                }

                setAccounts(allAccounts);
            } catch (error) {
                console.error('Erro ao carregar contas:', error);
            } finally {
                setLoading(false);
            }
        }

        loadAccounts();
    }, [mounted, selectedAccount]);

    if (!mounted || loading) {
        return null;
    }

    return (
        <AccountContext.Provider
            value={{
                selectedAccount,
                setSelectedAccount,
                accounts
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount() {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error("useAccount must be used within an AccountProvider");
    }
    return context;
}
