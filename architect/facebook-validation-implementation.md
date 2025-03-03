# Plano de Implementação - Correção da Validação Facebook

## Etapa 1: Correção dos Tipos
1. Atualizar `types/brand.ts`:
```typescript
export interface FacebookAccount {
  id: number;
  accessToken: string;
  name: string;
  status: string;
  brandId: number;
}

export interface FacebookAdAccount {
  id: number;
  accountId: string;
  accountName: string;
  brandId: number;
}
```

## Etapa 2: BrandContext
1. Atualizar método de validação:
```typescript
const isConfigured = (brand: Brand): boolean => {
  return !!(
    brand.facebookAccount?.status === 'active' &&
    brand.facebookAdAccounts?.length > 0
  );
};
```

## Etapa 3: DashboardMetrics
1. Atualizar componente para usar conta correta:
```typescript
const currentFilters = {
  brandId,
  accountId: selectedBrand?.facebookAdAccounts[0]?.accountId,
  since: dateRange.from,
  until: dateRange.to
};
```

## Etapa 4: Testes

1. Testar Conexão de Conta:
   - Conectar conta Facebook
   - Verificar se status está 'active'
   - Conectar conta de anúncios
   - Verificar se accountId foi salvo

2. Testar Dashboard:
   - Verificar se métricas são carregadas
   - Confirmar que não há erro de validação
   - Verificar se dados correspondem à conta selecionada

## Etapa 5: Atualizações de UI

1. Feedback Visual:
   - Mostrar status da conta Facebook
   - Mostrar contas de anúncio vinculadas
   - Indicar claramente próximos passos necessários

## Ordem de Implementação

1. Começar pelos tipos para garantir consistência
2. Atualizar BrandContext com nova validação
3. Ajustar componentes que usam as contas
4. Testar fluxo completo
5. Atualizar mensagens de erro/feedback

Esta implementação deve resolver o erro de validação e manter a consistência entre frontend e backend.