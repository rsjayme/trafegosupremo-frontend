"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Account {
    id: string;
    name: string;
}

interface AccountContextType {
    selectedAccount: Account | null;
    setSelectedAccount: (account: Account | null) => void;
    accounts: Account[];
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Mock de contas para exemplo
    const accounts: Account[] = [
        { id: "1", name: "Conta A" },
        { id: "2", name: "Conta B" },
        { id: "3", name: "Conta C" },
    ].sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
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
