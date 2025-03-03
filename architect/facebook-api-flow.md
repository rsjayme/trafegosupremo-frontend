# Fluxo de Chamadas à API do Facebook

## Estrutura de Dados

1. FacebookAccount (Conta Principal)
```typescript
{
    id: number;
    accessToken: string;  // Token usado para autenticação
    name: string;
    status: string;      // 'active' ou 'inactive'
    brandId: number;     // Relação 1:1 com Brand
}
```

2. FacebookAdAccount (Conta de Anúncios)
```typescript
{
    id: number;
    accountId: string;   // ID usado para buscar métricas
    accountName: string;
    brandId: number;     // Relação N:1 com Brand
}
```

## Fluxo de Autenticação

1. Conexão da Conta Facebook:
   - POST /facebook/accounts
   - Salva token de acesso e marca status como 'active'

2. Conexão da Conta de Anúncios:
   - POST /facebook/brands/:brandId/ad-accounts
   - Requer uma FacebookAccount ativa
   - Salva accountId necessário para métricas

## Fluxo de Métricas

1. Validação:
   - Brand deve ter FacebookAccount com status='active'
   - Brand deve ter pelo menos um FacebookAdAccount

2. Busca de Métricas:
   - GET /facebook/insights
   - Usa accountId do FacebookAdAccount
   - Usa accessToken do FacebookAccount para autenticação

## Ordem de Implementação

1. Frontend:
   - Primeiro conecta conta Facebook (obtém token)
   - Depois conecta conta de anúncios (salva accountId)
   - Por fim, busca métricas usando accountId

2. Backend:
   - Valida FacebookAccount ativa
   - Usa accountId do FacebookAdAccount para métricas
   - Usa token do FacebookAccount para autenticação

## Pontos de Atenção

1. Não confundir:
   - FacebookAccount.id (id interno)
   - FacebookAdAccount.accountId (id do Facebook)
   - FacebookAccount.accessToken (token de autenticação)

2. Ordem de verificações:
   - Primeiro valida existência de FacebookAccount ativa
   - Depois verifica se há FacebookAdAccount vinculada
   - Por fim usa os dados corretos para buscar métricas