# Plano de Correção do Dashboard Metrics

## Problema
O dashboard está tentando buscar métricas mesmo quando não há uma conta selecionada, causando erros porque o accountId é necessário para buscar as métricas.

## Análise
1. No componente DashboardMetrics há um bug onde a propriedade 'enabled' está duplicada nas opções do useDashboardData:
```typescript
{
    enabled: !!dateRange.from && !!dateRange.to && !!selectedAccount,
    enabled: !!dateRange.from && !!dateRange.to
}
```
A segunda linha sobrescreve a primeira, removendo a verificação de `!!selectedAccount`.

2. A estrutura atual dos contextos está correta:
   - BrandContext gerencia a marca selecionada
   - AccountContext gerencia a conta do Facebook selecionada
   - O accountId é obtido corretamente do selectedAccount

## Solução

1. Corrigir o bug no DashboardMetrics removendo a duplicação da propriedade 'enabled':
```typescript
{
    enabled: !!dateRange.from && !!dateRange.to && !!selectedAccount
}
```

2. Para melhorar a experiência do usuário:
   - Adicionar um feedback visual quando não houver conta selecionada
   - Exibir uma mensagem orientando o usuário a selecionar uma conta

## Próximos Passos

1. Corrigir o bug no componente DashboardMetrics
2. Implementar feedback visual para caso de conta não selecionada
3. Testar as métricas após a correção
4. Verificar se há outros componentes que podem ter bugs similares

## Modo de Implementação
Após aprovação deste plano, devemos mudar para o modo "Code" para implementar as correções necessárias.