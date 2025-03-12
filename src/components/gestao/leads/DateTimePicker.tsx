'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DateTimePickerProps {
    date?: Date;
    onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, onChange }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
    const [timeValue, setTimeValue] = React.useState(
        date ? format(date, 'HH:mm') : ''
    );

    // Atualiza o estado quando a prop date muda
    React.useEffect(() => {
        if (date) {
            setSelectedDate(date);
            setTimeValue(format(date, 'HH:mm'));
        }
    }, [date]);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && timeValue) {
            const [hours, minutes] = timeValue.split(':');
            const newDate = new Date(date.setHours(Number(hours), Number(minutes)));
            onChange?.(newDate);
        }
    };

    const handleTimeChange = (time: string) => {
        setTimeValue(time);
        if (selectedDate && time) {
            const [hours, minutes] = time.split(':');
            const newDate = new Date(selectedDate);
            newDate.setHours(Number(hours), Number(minutes));
            onChange?.(newDate);
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
                        selected={selectedDate}
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
            />
        </div>
    );
}