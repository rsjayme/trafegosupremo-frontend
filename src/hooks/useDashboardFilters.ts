import { useState, useCallback, useEffect } from 'react';
import { addDays, subDays, format } from 'date-fns';
import type { DashboardFilters } from '@/types/dashboard';

export const DEFAULT_DAYS_RANGE = 30;

export function useDashboardFilters(brandId: number) {
    const [filters, setFilters] = useState<DashboardFilters>(() => ({
        brandId,
        since: format(subDays(new Date(), DEFAULT_DAYS_RANGE), 'yyyy-MM-dd'),
        until: format(new Date(), 'yyyy-MM-dd'),
        comparison: false
    }));

    // Atualiza os filtros quando a marca muda
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            brandId,
            comparison: false // Reseta a comparação ao trocar de marca
        }));
    }, [brandId]);

    const updateDateRange = useCallback((since: Date, until: Date) => {
        setFilters(prev => ({
            ...prev,
            since: format(since, 'yyyy-MM-dd'),
            until: format(until, 'yyyy-MM-dd')
        }));
    }, []);

    const toggleComparison = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            comparison: !prev.comparison
        }));
    }, []);

    const setQuickDateRange = useCallback((days: number) => {
        const until = new Date();
        const since = subDays(until, days);
        updateDateRange(since, until);
    }, [updateDateRange]);

    const setPreviousPeriod = useCallback(() => {
        const currentSince = new Date(filters.since);
        const currentUntil = new Date(filters.until);
        const daysDiff = Math.ceil(
            (currentUntil.getTime() - currentSince.getTime()) / (1000 * 60 * 60 * 24)
        );

        const newUntil = subDays(currentSince, 1);
        const newSince = subDays(newUntil, daysDiff);

        updateDateRange(newSince, newUntil);
    }, [filters.since, filters.until, updateDateRange]);

    const setNextPeriod = useCallback(() => {
        const currentSince = new Date(filters.since);
        const currentUntil = new Date(filters.until);
        const daysDiff = Math.ceil(
            (currentUntil.getTime() - currentSince.getTime()) / (1000 * 60 * 60 * 24)
        );

        const newSince = addDays(currentUntil, 1);
        const newUntil = addDays(newSince, daysDiff);

        // Não permitir datas futuras
        if (newUntil > new Date()) return;

        updateDateRange(newSince, newUntil);
    }, [filters.since, filters.until, updateDateRange]);

    return {
        filters,
        updateDateRange,
        toggleComparison,
        setQuickDateRange,
        setPreviousPeriod,
        setNextPeriod,

        // Helper para verificar se pode avançar para o próximo período
        canGoToNextPeriod: addDays(new Date(filters.until), 1) <= new Date()
    };
}