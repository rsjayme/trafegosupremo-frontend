import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DEFAULT_DAYS_RANGE } from '@/hooks/useDashboardFilters';

interface Props {
    since: string;
    until: string;
    onDateChange: (since: Date, until: Date) => void;
    onComparisonToggle: () => void;
    onQuickDateSelect: (days: number) => void;
    onPreviousPeriod: () => void;
    onNextPeriod: () => void;
    showComparison: boolean;
    canGoToNextPeriod: boolean;
}

export function DashboardFilters({
    since,
    until,
    onDateChange,
    onComparisonToggle,
    onQuickDateSelect,
    onPreviousPeriod,
    onNextPeriod,
    showComparison,
    canGoToNextPeriod
}: Props) {
    const formatDate = (date: string) => {
        return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
    };

    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDateSelect(7)}
                >
                    7 dias
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDateSelect(15)}
                >
                    15 dias
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDateSelect(DEFAULT_DAYS_RANGE)}
                >
                    30 dias
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPeriod}
                >
                    ←
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="min-w-[240px]">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formatDate(since)} - {formatDate(until)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="range"
                            selected={{
                                from: new Date(since),
                                to: new Date(until)
                            }}
                            onSelect={(range) => {
                                if (range?.from && range?.to) {
                                    onDateChange(range.from, range.to);
                                }
                            }}
                            numberOfMonths={2}
                            locale={ptBR}
                        />
                    </PopoverContent>
                </Popover>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPeriod}
                    disabled={!canGoToNextPeriod}
                >
                    →
                </Button>
            </div>

            <Button
                variant={showComparison ? "default" : "outline"}
                size="sm"
                onClick={onComparisonToggle}
            >
                Comparar períodos
            </Button>
        </div>
    );
}