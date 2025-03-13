'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import type { LeadsFilter } from '@/lib/types/lead';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type DateField = 'createdAt' | 'lastContactDate' | 'nextContactDate';

// Type 'DateField' is not assignable to type '"createdAt" | "lastContactDate" | "nextContactDate"'.ts(2322)
// Como tipar corretamente? 
const dateFieldLabels: Record<DateField, string> = {
    createdAt: 'Data de Criação',
    lastContactDate: 'Data do Último Contato',
    nextContactDate: 'Data do Próximo Contato'
};

// Ordem fixa para as opções do select
const dateFieldOrder: DateField[] = ['createdAt', 'lastContactDate', 'nextContactDate'];

interface LeadsDateFilterProps {
    onFilterChange: (filter: LeadsFilter) => void;
}

export function LeadsDateFilter({ onFilterChange }: LeadsDateFilterProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [dateField, setDateField] = useState<DateField>('createdAt');

    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range);
        onFilterChange({ dateField, range });
    };

    const handleFieldChange = (value: DateField) => {
        setDateField(value);
        onFilterChange({ dateField: value, range: date });
    };

    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <Select
                value={dateField}
                onValueChange={handleFieldChange}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                    {dateFieldOrder.map((field) => (
                        <SelectItem key={field} value={field}>
                            {dateFieldLabels[field]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "P", { locale: ptBR })} -{" "}
                                    {format(date.to, "P", { locale: ptBR })}
                                </>
                            ) : (
                                format(date.from, "P", { locale: ptBR })
                            )
                        ) : (
                            <span>Selecione um período</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>

            {date && (
                <Button
                    variant="ghost"
                    onClick={() => handleDateSelect(undefined)}
                >
                    Limpar
                </Button>
            )}
        </div>
    );
}