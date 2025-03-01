# DashboardCampaigns Component

## Overview
O componente DashboardCampaigns exibe métricas de campanhas do Facebook, incluindo métricas base (sempre visíveis) e métricas de ações personalizáveis.

## Métricas Base (Fixas)
As seguintes métricas são sempre exibidas para cada campanha:
- **Impressões**: Total de impressões
- **Cliques**: Total de cliques
- **Investimento**: Valor investido
- **CPC**: Custo por clique
- **CTR**: Taxa de cliques
- **CPM**: Custo por mil impressões
- **Alcance**: Alcance total
- **Frequência**: Frequência média

## Métricas de Ações (Personalizáveis)
- Podem ser selecionadas globalmente ou por campanha
- São exibidas após as métricas base
- Incluem custo por ação quando disponível

## Uso

```tsx
import { DashboardCampaigns } from "@/components/DashboardCampaigns";

// Na sua página ou componente
<DashboardCampaigns
  brandId={123}
  since="2025-01-01"
  until="2025-01-31"
/>
```

## Estrutura dos Componentes

```
DashboardCampaigns/
├── index.tsx            # Componente principal
├── CampaignItem.tsx    # Item individual de campanha
├── CampaignMetrics.tsx # Exibição de métricas
├── MetricCard.tsx      # Card individual de métrica
├── formatters.ts       # Funções de formatação
├── metric-labels.ts    # Labels em português
├── storage.ts          # Persistência de preferências
└── README.md          # Esta documentação
```

## Features

1. Métricas Base
   - Sempre visíveis
   - Não podem ser desabilitadas
   - Ordem consistente

2. Métricas de Ações
   - Personalizáveis por campanha
   - Seleção global disponível
   - Persistência de preferências

3. Layout
   - Grid responsivo
   - Wrapping automático
   - Espaçamento consistente

4. Formatação
   - Valores em formato BR
   - Labels em português
   - Formatação contextual (%, R$, etc)

## Personalização de Métricas

### Seleção Global
```tsx
// Métricas selecionadas são aplicadas a todas as campanhas
<ActionSelector
  selectedActions={globalActions}
  onSelectionChange={setGlobalActions}
/>
```

### Seleção por Campanha
```tsx
// Métricas específicas para uma campanha
<ActionSelector
  selectedActions={campaignActions[campaignId]}
  onSelectionChange={(actions) => handleCampaignActionChange(campaignId, actions)}
/>
```

## Storage
As preferências de seleção são salvas no localStorage:
- `dashboard-global-actions`: Seleção global
- `dashboard-campaign-actions-{id}`: Seleção específica por campanha

## Exemplos de Valores

### Métricas Base
```typescript
{
  impressions: "1.234.567",
  clicks: "12.345",
  spend: "R$ 1.234,56",
  cpc: "R$ 0,10",
  ctr: "1,23%",
  cpm: "R$ 1,00",
  reach: "987.654",
  frequency: "1,25"
}
```

### Métricas de Ações
```typescript
{
  action_type: "post_engagement",
  value: "1.234",
  cost: "R$ 0,50"
}
```

## Manutenção

### Adicionar Nova Métrica Base
1. Adicionar ao tipo `BaseMetrics`
2. Adicionar ao array `BASE_METRICS`
3. Adicionar label em `metric-labels.ts`
4. Adicionar formatação em `formatters.ts`

### Adicionar Nova Métrica de Ação
1. Adicionar label em `metric-labels.ts`
2. Formatação usa padrão de números