'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { SelectSingleEventHandler } from 'react-day-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DateTimePickerProps {
    date: Date | null;
    onChange: (date: Date | null) => void;
}

export function DateTimePicker({ date, onChange }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(date);
    const [timeValue, setTimeValue] = React.useState(
        date ? format(date, 'HH:mm') : ''
    );

    // Atualiza o estado quando a prop date muda
    React.useEffect(() => {
        setSelectedDate(date);
        setTimeValue(date ? format(date, 'HH:mm') : '');
    }, [date]);

    const handleDateSelect: SelectSingleEventHandler = (newDate) => {
        // Convertemos undefined para null para manter consistência
        if (!newDate) {
            setSelectedDate(null);
            setTimeValue('');
            onChange(null);
            return;
        }

        // Se tiver data selecionada
        const dateValue = newDate;
        setSelectedDate(dateValue);

        // Se já tiver horário, usa ele, senão usa meia-noite
        if (timeValue) {
            const [hours, minutes] = timeValue.split(':');
            const dateWithTime = new Date(dateValue);
            dateWithTime.setHours(Number(hours), Number(minutes));
            onChange(dateWithTime);
        } else {
            // Define horário como meia-noite se não houver horário
            const dateWithDefaultTime = new Date(dateValue);
            dateWithDefaultTime.setHours(0, 0, 0, 0);
            onChange(dateWithDefaultTime);
        }
    };

    const handleTimeChange = (time: string) => {
        setTimeValue(time);

        if (!selectedDate) return;

        if (time) {
            const [hours, minutes] = time.split(':');
            const newDate = new Date(selectedDate);
            newDate.setHours(Number(hours), Number(minutes));
            onChange(newDate);
        } else {
            // Se limpar o horário, mantém a data com horário meia-noite
            const dateWithDefaultTime = new Date(selectedDate);
            dateWithDefaultTime.setHours(0, 0, 0, 0);
            onChange(dateWithDefaultTime);
        }
    };

    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                            format(selectedDate, 'PPP', { locale: ptBR })
                        ) : (
                            <span>Selecione uma data</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={handleDateSelect}
                        locale={ptBR}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Input
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-[140px]"
                disabled={!selectedDate}
            />
        </div>
    );
}