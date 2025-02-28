# Plano de Integração do Dashboard com a API

## 1. Estrutura Atual

### Backend (Rotas Disponíveis)
- `/api/facebook/insights/{brandId}/overview` - Visão geral das métricas
- `/api/facebook/insights/{brandId}/daily` - Métricas diárias
- `/api/facebook/insights/{brandId}/demographics` - Métricas demográficas
- `/api/facebook/insights/{brandId}/locations` - Métricas por localização
- `/api/facebook/insights/{brandId}/devices` - Métricas por dispositivo

### Frontend (Componentes)
- `DashboardCharts` - Exibe gráficos com métricas diárias
- Métricas principais:
  - Gasto Diário
  - Resultados Diários
  - CPA Diário
  - CTR Diário

## 2. Plano de Implementação

### 2.1 Custom Hooks para Dados

```typescript
// hooks/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard";
import type { DashboardData, DashboardFilters } from "@/types/dashboard";

const dashboardService = new DashboardService();

export function useDashboardData(filters: DashboardFilters) {
    return useQuery({
        queryKey: ["dashboard", filters],
        queryFn: () => dashboardService.getDashboardData(filters),
        staleTime: 15 * 60 * 1000, // 15 minutos conforme TTL da API
        refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
        retry: (failureCount, error) => {
            // Não tentar novamente para erros específicos do Facebook
            if (error.code === 190 || error.code === 200) return false;
            return failureCount < 3;
        }
    });
}

// hooks/useDashboardFilters.ts
import { useState, useCallback } from "react";
import { addDays, subDays, format } from "date-fns";

export function useDashboardFilters(brandId: number) {
    const [filters, setFilters] = useState<DashboardFilters>({
        brandId,
        since: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        until: format(new Date(), "yyyy-MM-dd"),
        comparison: false
    });

    const updateDateRange = useCallback((since: Date, until: Date) => {
        setFilters(prev => ({
            ...prev,
            since: format(since, "yyyy-MM-dd"),
            until: format(until, "yyyy-MM-dd")
        }));
    }, []);

    const toggleComparison = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            comparison: !prev.comparison
        }));
    }, []);

    return {
        filters,
        updateDateRange,
        toggleComparison
    };
}
```

### 2.2 Tipos de Dados

```typescript
// types/dashboard.ts
export interface InsightMetrics {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    cpc: number;
    ctr: number;
    cpm: number;
    actions: InsightAction[];
}

export interface InsightAction {
    action_type: string;
    value: number;
}

export interface DailyInsights {
    date: string;
    metrics: InsightMetrics;
}

export interface DemographicInsights {
    demographic_type: 'age' | 'gender' | 'age_gender';
    value: string;
    metrics: Omit<InsightMetrics, 'actions'>;
}

export interface LocationInsights {
    country: string;
    region?: string;
    metrics: Omit<InsightMetrics, 'actions'>;
}

export interface DeviceInsights {
    device_type: string;
    platform: string;
    metrics: Omit<InsightMetrics, 'actions'>;
}

export interface DashboardData {
    overview: InsightMetrics;
    daily: DailyInsights[];
    demographics: DemographicInsights[];
    locations: LocationInsights[];
    devices: DeviceInsights[];
}

export interface DateRange {
    since: string;
    until: string;
}

export interface DashboardFilters extends DateRange {
    brandId: number;
    comparison?: boolean;
}
```

### 2.3 Serviço de API
```typescript
// services/dashboard.ts
export class DashboardService {
    // Busca todas as métricas necessárias para o dashboard
    async getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
        const [overview, daily, demographics, locations, devices] = await Promise.all([
            this.getOverview(filters),
            this.getDailyMetrics(filters),
            this.getDemographics(filters),
            this.getLocations(filters),
            this.getDevices(filters)
        ]);

        return {
            overview,
            daily,
            demographics,
            locations,
            devices
        };
    }

    // Métricas gerais do período
    private async getOverview(filters: DashboardFilters): Promise<InsightMetrics> {
        return api.get(`/facebook/insights/${filters.brandId}/overview`, { params: filters });
    }

    // Métricas diárias
    private async getDailyMetrics(filters: DashboardFilters): Promise<DailyInsights[]> {
        return api.get(`/facebook/insights/${filters.brandId}/daily`, { params: filters });
    }

    // Métricas demográficas
    private async getDemographics(filters: DashboardFilters): Promise<DemographicInsights[]> {
        return api.get(`/facebook/insights/${filters.brandId}/demographics`, { params: filters });
    }

    // Métricas por localização
    private async getLocations(filters: DashboardFilters): Promise<LocationInsights[]> {
        return api.get(`/facebook/insights/${filters.brandId}/locations`, { params: filters });
    }

    // Métricas por dispositivo
    private async getDevices(filters: DashboardFilters): Promise<DeviceInsights[]> {
        return api.get(`/facebook/insights/${filters.brandId}/devices`, { params: filters });
    }
}
```

### 2.4 Atualizações nos Componentes

#### DashboardCharts
- Substituir dados mockados por dados reais da API
- Implementar loading states
- Adicionar tratamento de erros
- Implementar cache de dados
- Adicionar controles de data

#### DashboardMetrics
- Criar novo componente para métricas gerais
- Exibir totais e médias do período
- Implementar comparação com período anterior

## 3. Requisitos Técnicos

### 3.1 Performance
- Implementar cache client-side com SWR/React Query
- Utilizar o cache TTL definido na API:
  - Métricas: 15 minutos
  - Informações da conta: 1 hora

### 3.2 Error Handling
- Tratamento específico para erros do Facebook (190, 17, 200, 272)
- Feedback visual para o usuário
- Retry automático para erros temporários

### 3.3 UX/UI
- Loading states em todos os componentes
- Feedback de erro visível
- Tooltips informativos
- Filtros de data intuitivos

## 4. Etapas de Implementação

1. **Fase 1 - Estrutura Base**
   - Criar tipos de dados
   - Implementar serviço de API
   - Desenvolver custom hook base

2. **Fase 2 - Integração de Dados**
   - Atualizar DashboardCharts
   - Criar componente de métricas gerais
   - Implementar filtros de data

3. **Fase 3 - Otimização**
   - Implementar cache
   - Adicionar error handling
   - Otimizar performance

4. **Fase 4 - Polimento**
   - Melhorar UX/UI
   - Adicionar animações
   - Implementar features adicionais

## 5. Considerações de Segurança

- Validar tokens de autenticação
- Sanitizar inputs de data
- Implementar rate limiting no cliente
- Seguir práticas de CORS

## 6. Monitoramento

- Implementar logging de erros
- Monitorar tempo de resposta
- Tracking de uso de cache
- Monitoramento de rate limits

## 7. Resumo da Implementação

### Primeira Fase: Estrutura Base
1. Criar tipos em `types/dashboard.ts`
2. Implementar DashboardService em `services/dashboard.ts`
3. Desenvolver hooks `useDashboardData` e `useDashboardFilters`

### Segunda Fase: Componentes
1. Criar DateRangePicker para controle de período
2. Atualizar DashboardCharts para usar dados reais
3. Implementar componentes para cada tipo de métrica:
   - Overview
   - Gráficos diários
   - Demographics
   - Locations
   - Devices

### Terceira Fase: Otimização
1. Configurar React Query para caching
2. Implementar error boundaries
3. Adicionar loading states
4. Otimizar re-renders

### Quarta Fase: Refinamentos
1. Melhorar UX com feedback visual
2. Adicionar tooltips informativos
3. Implementar comparação de períodos
4. Adicionar exportação de dados

## 8. Próximos Passos

Com o plano definido, podemos começar a implementação:

1. **Criação da Estrutura**
   - Tipos do dashboard
   - Serviço de API
   - Setup do React Query

2. **Implementação dos Hooks**
   - useDashboardData
   - useDashboardFilters
   - Configuração do cache

3. **Atualização dos Componentes**
   - DashboardCharts
   - Novos componentes de métricas
   - Controles de filtro

4. **Otimização e Testes**
   - Error boundaries
   - Loading states
   - Testes de integração

É recomendado mudar para o modo Code para iniciar a implementação deste plano.