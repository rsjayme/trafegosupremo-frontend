# Dashboard Metrics Fix Plan

## Problema
- O componente DashboardMetrics está usando hooks e contextos legados que fazem chamadas para endpoints inexistentes
- Precisa ser atualizado para usar o novo serviço de dashboard que já está configurado corretamente

## Passos

1. Remover dependências desnecessárias
   - Remover useFacebookData
   - Remover FacebookContext
   - Remover importações relacionadas a campanhas

2. Atualizar DashboardMetrics
   - Usar o novo serviço de dashboard ao invés do useFacebookData
   - Atualizar props para receber brandId ao invés de accountId
   - Usar o hook useDashboardData para buscar métricas

3. Ajustar chamada de métricas
   - Usar /facebook/insights/:brandId/overview ao invés de campanhas
   - Ajustar formatação dos dados para o novo formato de resposta
   - Manter a lógica de comparação entre períodos

4. Manter funcionalidades existentes
   - Formatação de números e moeda
   - Cálculos de comparação percentual
   - Loading states e tratamento de erros
   - Botão de atualização

## Benefícios
- Remove código obsoleto
- Usa a API correta do backend
- Mantém todas as funcionalidades existentes
- Simplifica o fluxo de dados