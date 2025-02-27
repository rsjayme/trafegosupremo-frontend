"use client"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface CampaignFiltersProps {
    onDateChange: (date: { from: Date | undefined; to: Date | undefined }) => void
    onStatusChange: (status: string) => void
    dateRange: { from: Date | undefined; to: Date | undefined }
    status: string
}

export function CampaignFilters({
    onDateChange,
    onStatusChange,
    dateRange,
    status,
}: CampaignFiltersProps) {
    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-6">
            <div className="flex-1">
                <DateRangePicker
                    date={dateRange}
                    onDateChange={onDateChange}
                />
            </div>
            <div>
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Ativa">Ativa</SelectItem>
                        <SelectItem value="Pausada">Pausada</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}