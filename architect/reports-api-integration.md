# Correção da Integração de Dados Diários

## Problema Identificado
- O gráfico de linha está usando dados estáticos ao invés dos dados da API
- A função processTimelineData na página está duplicando lógica já existente
- Não estamos usando a função formatTimelineData do serviço FacebookInsights

## Solução Proposta

1. Remover a função processTimelineData da página e usar formatTimelineData do serviço
```typescript
// Antes
const timelineData = daily ? processTimelineData(daily) : DEFAULT_TIMELINE_DATA;

// Depois
const timelineData = daily ? insights.formatTimelineData(daily) : DEFAULT_TIMELINE_DATA;
```

2. Garantir que os dados diários estão sendo formatados corretamente no adaptDataForCanvas:
```typescript
const account: Account = {
    id: String(selectedBrand?.id || DEFAULT_ACCOUNT.id),
    name: selectedBrand?.name || DEFAULT_ACCOUNT.name,
    metrics: {
        impressions: overview ? insights.formatValue(overview.impressions) : 0,
        // ... outras métricas ...
    },
    demographics: {
        age: demographics ? insights.groupByAge(demographics) : {},
        gender: demographics ? insights.groupByGender(demographics) : {},
        location: {}
    },
    daily: daily ? insights.formatTimelineData(daily) : DEFAULT_TIMELINE_DATA
};
```

## Fluxo de Dados Corrigido

1. API `/facebook/insights/{brandId}/daily` retorna dados diários
2. FacebookInsightsService.formatTimelineData processa os dados:
   - Ordena por data
   - Converte valores para números
   - Estrutura no formato esperado pelo gráfico
3. Account recebe os dados formatados no campo daily
4. ReportsCanvas renderiza o gráfico com dados reais

## Próximos Passos

1. Implementar as correções propostas
2. Testar a integração verificando:
   - Dados chegando da API
   - Formatação correta pelo serviço
   - Exibição no gráfico de linha
3. Verificar logs para garantir que não há erros de conversão

## Impacto da Mudança

- Remove duplicação de código
- Centraliza lógica de formatação no serviço
- Garante consistência no processamento dos dados
- Utiliza dados reais da API ao invés de mockados