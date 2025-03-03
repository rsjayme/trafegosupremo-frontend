# Plano de Implementação - Select de Vinculação Marca/Conta de Anúncio

## Pré-requisitos
- A marca precisa ter uma conta Facebook ativa
- O usuário precisa estar autenticado

## Rotas Backend
- GET `/facebook/available-ad-accounts` - Lista contas de anúncio disponíveis
- GET `/facebook/brands/:brandId/ad-accounts` - Lista contas já vinculadas à marca
- POST `/facebook/brands/:brandId/ad-accounts` - Vincula uma conta à marca

## Estrutura do Componente
```typescript
interface AdAccountSelectProps {
  brandId: number;
  onAccountSelect?: (success: boolean) => void;
}
```

## Dados da API
1. Contas Disponíveis (GET /facebook/available-ad-accounts):
```typescript
interface FacebookAdAccount {
  id: string;
  account_id: string;
  name: string;
  business: { 
    id: string | null 
  }
}
```

2. Payload para Vincular (POST /facebook/brands/:brandId/ad-accounts):
```typescript
interface ConnectAdAccountDto {
  accountId: string;
  accountName: string;
  businessId?: string;
}
```

## Etapas de Implementação

1. Frontend:
- Criar componente `AdAccountSelect` usando o select.tsx existente
- Carregar lista de contas disponíveis no mount 
- Ao selecionar, enviar requisição para vincular
- Tratar erros comuns (marca sem conta Facebook, conta já vinculada)

2. Integração:
- Usar o componente onde necessário (provavelmente na configuração da marca)
- Atualizar estado local/global após vinculação bem sucedida
- Mostrar feedback visual do resultado para o usuário

## Notas
- Interface simples e direta
- Validações importantes no backend já existem
- Usar componentes UI existentes
- Tratar erros de forma amigável