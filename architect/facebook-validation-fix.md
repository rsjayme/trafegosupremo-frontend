# Correção do Erro de Validação Facebook

## Problema
Frontend está recebendo erro 400 "Brand has no active Facebook account" mesmo com conta configurada corretamente.

## Causa
BrandContext está validando campo incorreto:
```typescript
// Código atual - ERRADO
return !!(brand.facebookAccount?.status === 'active' &&
    brand.facebookAccount?.accountId && // Este campo não existe
    brand.facebookAdAccounts?.length > 0);
```

## Solução
Atualizar apenas a validação no BrandContext para usar os campos corretos:
```typescript
// Código corrigido
return !!(brand.facebookAccount?.status === 'active' &&
    brand.facebookAdAccounts?.length > 0);
```

## Implementação
1. Alterar apenas o método isConfigured no BrandContext
2. Manter todo o resto do código inalterado
3. Validar que o erro 400 não ocorre mais

Foco somente na correção do erro, sem outras alterações ou melhorias.