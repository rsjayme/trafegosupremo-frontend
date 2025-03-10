"use client";

import { useBrands } from "@/hooks/useBrands";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BrandSelectorProps {
    value?: number;
    onChange: (brandId: number) => void;
}

export function BrandSelector({ value, onChange }: BrandSelectorProps) {
    const { data: brands, isLoading } = useBrands(true);

    if (isLoading) {
        return (
            <Select disabled>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Carregando marcas..." />
                </SelectTrigger>
            </Select>
        );
    }

    if (!brands?.length) {
        return (
            <Select disabled>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Nenhuma marca encontrada" />
                </SelectTrigger>
            </Select>
        );
    }

    return (
        <Select
            value={value?.toString()}
            onValueChange={(value) => onChange(Number(value))}
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
}