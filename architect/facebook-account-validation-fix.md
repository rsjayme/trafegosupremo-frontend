# Correção da Validação de Conta Facebook

## Problemas Identificados

1. Validação Incorreta no BrandContext:
```typescript
return !!(brand.facebookAccount?.status === 'active' &&
    brand.facebookAccount?.accountId &&  // Campo não existe
    brand.facebookAdAccounts?.length > 0);
```

2. Fluxo de Dados no Dashboard:
- O frontend tenta usar accountId da conta do Facebook
- O backend espera accountId da conta de anúncios (FacebookAdAccount)
- A validação no backend falha porque está procurando no lugar errado

## Correções Necessárias

1. Atualizar tipos no frontend para corresponder ao backend:
```typescript
interface FacebookAccount {
    id: number;
    accessToken: string;
    name: string;
    status: string;
    brandId: number;
}

interface FacebookAdAccount {
    id: number;
    accountId: string;  // Este é o campo que devemos usar
    accountName: string;
    businessId?: string;
    brandId: number;
}
```

2. Corrigir validação no BrandContext:
```typescript
return !!(
    brand.facebookAccount?.status === 'active' &&
    brand.facebookAdAccounts?.length > 0
);
```

3. Ajustar chamadas de API no dashboard:
- Usar o accountId da primeira conta de anúncios vinculada (facebookAdAccounts[0].accountId)
- Remover dependência do accountId da conta do Facebook

## Fluxo de Dados Corrigido

1. Frontend verifica se a marca tem:
   - Uma conta Facebook ativa
   - Pelo menos uma conta de anúncios vinculada

2. Ao buscar métricas:
   - Usa o accountId da conta de anúncios
   - Passa o token de acesso da conta Facebook

## Próximos Passos

1. Atualizar definições de tipos no frontend
2. Corrigir o método isConfigured no BrandContext
3. Atualizar lógica de chamadas de API no dashboard
4. Testar fluxo completo de validação

## Impacto

- Resolve o erro "Brand has no active Facebook account"
- Mantém consistência entre frontend e backend
- Usa os campos corretos para validação
- Simplifica a lógica de verificação