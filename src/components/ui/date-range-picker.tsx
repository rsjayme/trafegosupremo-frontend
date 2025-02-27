"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { DayPicker, SelectRangeEventHandler } from "react-day-picker"

export interface DateRangePickerProps {
    date: { from: Date | undefined; to: Date | undefined }
    onDateChange: (date: { from: Date | undefined; to: Date | undefined }) => void
    className?: string
}

export function DateRangePicker({
    date,
    onDateChange,
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handlePresetClick = (days: number) => {
        const to = new Date()
        const from = new Date()
        from.setDate(to.getDate() - days)
        onDateChange({ from, to })
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal w-[300px]",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                                    {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                                </>
                            ) : (
                                format(date.from, "dd/MM/yyyy", { locale: ptBR })
                            )
                        ) : (
                            <span>Selecione um período</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="space-y-2 p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePresetClick(7)}
                            >
                                Últimos 7 dias
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePresetClick(30)}
                            >
                                Últimos 30 dias
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const yesterday = new Date()
                                    yesterday.setDate(yesterday.getDate() - 1)
                                    onDateChange({ from: yesterday, to: yesterday })
                                }}
                            >
                                Ontem
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const today = new Date()
                                    onDateChange({ from: today, to: today })
                                }}
                            >
                                Hoje
                            </Button>
                        </div>
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={onDateChange as SelectRangeEventHandler}
                            numberOfMonths={2}
                            locale={ptBR}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}