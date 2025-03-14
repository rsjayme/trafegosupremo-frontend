import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { type FilterClientsParams } from "@/services/clients"

interface ClientsFiltersProps {
    filters: FilterClientsParams
    onFilterChange: (filters: FilterClientsParams) => void
    onClearFilters: () => void
}

export function ClientsFilters({
    filters,
    onFilterChange,
    onClearFilters
}: ClientsFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex-1">
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, empresa ou email"
                        className="pl-10"
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Select
                    value={filters.status?.join(',') || ''}
                    onValueChange={(value) => {
                        const statusArray = value ? value.split(',') as ('ATIVO' | 'INATIVO')[] : undefined
                        onFilterChange({ ...filters, status: statusArray })
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="ATIVO">Ativo</SelectItem>
                            <SelectItem value="INATIVO">Inativo</SelectItem>
                            <SelectItem value="ATIVO,INATIVO">Todos</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    onClick={onClearFilters}
                >
                    <X className="mr-2 h-4 w-4" />
                    Limpar
                </Button>
            </div>
        </div>
    )
}