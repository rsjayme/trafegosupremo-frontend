"use client";

import { Crown, SignOut } from "@phosphor-icons/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/contexts/AccountContext";
import { useEffect, useState } from "react";

export function Header() {
    const { clearToken } = useAuth();
    const { accounts, selectedAccount, setSelectedAccount } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <header className="border-b bg-background">
            <div className="px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-primary" weight="fill" />
                    <span className="text-xl font-semibold">Tráfego Supremo</span>
                </div>

                <div className="flex items-center gap-4">
                    <Select
                        value={selectedAccount?.id}
                        onValueChange={(value) => {
                            const account = accounts.find((a) => a.id === value);
                            setSelectedAccount(account || null);
                        }}
                    >
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => clearToken()}
                        title="Sair"
                    >
                        <SignOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
