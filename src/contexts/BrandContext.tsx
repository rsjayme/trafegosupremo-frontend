"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Brand } from "@/types/brand";
import { brandsService } from "@/services/brands";

interface BrandContextType {
    selectedBrand: Brand | null;
    setSelectedBrand: (brand: Brand | null) => void;
    brands: Brand[];
    isLoading: boolean;
    error: string | null;
    refetchBrands: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await brandsService.listConnectedBrands();
            setBrands(data);
        } catch (err) {
            setError("Erro ao carregar marcas");
            console.error("Erro ao carregar marcas:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchBrands();
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <BrandContext.Provider
            value={{
                selectedBrand,
                setSelectedBrand,
                brands,
                isLoading,
                error,
                refetchBrands: fetchBrands
            }}
        >
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    const context = useContext(BrandContext);
    if (context === undefined) {
        throw new Error("useBrand must be used within a BrandProvider");
    }
    return context;
}