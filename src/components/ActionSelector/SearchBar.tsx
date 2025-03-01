import * as React from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (term: string) => void;
    totalActions: number;
    matchCount: number;
    suggestions?: string[];
    className?: string;
}

// SearchHighlight component for highlighting matched text
export interface SearchHighlightProps {
    text: string;
    highlight: string;
    className?: string;
}

export function SearchHighlight({ text, highlight, className }: SearchHighlightProps) {
    if (!highlight.trim()) {
        return <span className={className}>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (
        <span className={className}>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <Badge
                        key={i}
                        variant="default"
                        className="px-1 py-0 text-[0.7em] font-normal bg-primary/20 text-primary border-none"
                    >
                        {part}
                    </Badge>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

export function SearchBar({
    onSearch,
    totalActions,
    matchCount,
    suggestions,
    className
}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSearch = React.useCallback(
        (value: string) => {
            setSearchTerm(value);
            onSearch(value);
        },
        [onSearch]
    );

    const clearSearch = () => {
        handleSearch("");
        inputRef.current?.focus();
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div
                className={cn(
                    "flex items-center gap-2 w-full rounded-lg border bg-background px-3 py-2 text-sm",
                    "ring-offset-background transition-colors duration-200",
                    isFocused && "ring-2 ring-ring ring-offset-2",
                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
            >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Buscar métricas..."
                    className={cn(
                        "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                        "text-sm"
                    )}
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="rounded-full p-1 hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Limpar busca</span>
                    </button>
                )}
            </div>

            {searchTerm && (
                <div className="flex items-center gap-2 px-1">
                    <p className="text-sm text-muted-foreground">
                        {matchCount} de {totalActions} métricas encontradas
                    </p>
                    {matchCount > 0 && suggestions && suggestions.length > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Sugestões:</span>
                            {suggestions.slice(0, 3).map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSearch(suggestion)}
                                    className="hover:underline text-sm text-primary"
                                >
                                    <SearchHighlight
                                        text={suggestion}
                                        highlight={searchTerm}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}