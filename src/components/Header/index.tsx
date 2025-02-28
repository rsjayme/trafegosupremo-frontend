"use client";

import { Crown, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useEffect, useState } from "react";

export function Header() {
    const { logout } = useAuth();
    const { brands, selectedBrand, setSelectedBrand, isLoading, error } = useBrand();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const renderBrandSelector = () => {
        if (isLoading) {
            return (
                <div className="w-[280px] h-10 bg-muted animate-pulse rounded-md" />
            );
        }

        if (error) {
            return (
                <div className="text-sm text-destructive">
                    Erro ao carregar marcas
                </div>
            );
        }

        if (!brands || brands.length === 0) {
            return (
                <div className="flex items-center gap-2">
                    <Link
                        href="/marcas"
                        className="text-sm text-primary hover:underline"
                    >
                        Conectar marca ao Facebook
                    </Link>
                    <span className="text-xs text-muted-foreground">
                        (Necessário para acessar o dashboard)
                    </span>
                </div>
            );
        }

        return (
            <Select
                value={selectedBrand?.id.toString()}
                onValueChange={(value) => {
                    const brand = brands.find((b) => b.id.toString() === value);
                    setSelectedBrand(brand || null);
                }}
            >
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                    {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    };

    return (
        <header className="border-b bg-background">
            <div className="px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-primary" weight="fill" />
                    <span className="text-xl font-semibold">Tráfego Supremo</span>
                </div>

                <div className="flex items-center gap-4">
                    {renderBrandSelector()}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => logout()}
                        title="Sair"
                    >
                        <SignOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
