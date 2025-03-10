import * as React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (term: string) => void;
    placeholder?: string;
}

export function SearchBar({
    onSearch,
    placeholder = "Buscar..."
}: SearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-md border pl-9 py-2 text-sm"
                placeholder={placeholder}
            />
        </div>
    );
}