# Análise do Gráfico de Linha - Origem dos Dados

## Problema Identificado
Encontrei o problema: o componente LineChartWidget está usando dados mockados ao invés dos dados da API:

```typescript
// front/src/components/ReportsCanvas/index.tsx - linha 169
data: [
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
],
```

## Correção Necessária

O LineChartWidget deveria estar usando os dados da prop `data` passada ao componente, especificamente o campo `daily` que contém os dados temporais:

```typescript
function LineChartWidget({ widget, data }: { widget: Widget; data: MockData }) {
    // Pegar a primeira conta (no momento só temos uma)
    const account = data.accounts[0];
    
    const chartData = {
        labels: account.daily.dates,
        datasets: widget.config.metrics?.map((metricKey, index) => ({
            label: metrics[metricKey]?.label || metricKey,
            data: account.daily.metrics[metricKey],
            borderColor: COLORS[index % COLORS.length],
            backgroundColor: COLORS[index % COLORS.length],
            tension: 0.4,
        }))
    };
}
```

## Fluxo Correto dos Dados

1. API retorna dados diários em `/facebook/insights/{brandId}/daily`
2. Dados são processados pelo FacebookInsightsService.formatTimelineData()
3. Dados formatados são armazenados em `account.daily`
4. LineChartWidget deveria usar esses dados ao invés de gerar números aleatórios

## Próximos Passos

1. Atualizar a assinatura do LineChartWidget para incluir a prop data
2. Remover a geração de dados aleatórios
3. Implementar o acesso aos dados reais da API
4. Manter a formatação e opções do gráfico conforme estão