# Implementação da Vinculação de Contas de Anúncio

## 1. Atualizar FacebookService

Adicionar as seguintes interfaces e métodos ao `front/src/services/facebook.ts`:

```typescript
// Novas interfaces
export interface FacebookAdAccount {
  id: string;
  account_id: string;
  name: string;
  business: {
    id: string | null;
  }
}

export interface ConnectAdAccountDto {
  accountId: string;
  accountName: string;
  businessId?: string;
}

// Novos métodos na classe FacebookService
class FacebookService {
  // ... métodos existentes ...

  async getAvailableAdAccounts(): Promise<FacebookAdAccount[]> {
    const response = await api.get<FacebookAdAccount[]>('/facebook/available-ad-accounts');
    return response.data;
  }

  async getBrandAdAccounts(brandId: number): Promise<FacebookAdAccount[]> {
    const response = await api.get<FacebookAdAccount[]>(`/facebook/brands/${brandId}/ad-accounts`);
    return response.data;
  }

  async connectAdAccount(brandId: number, data: ConnectAdAccountDto): Promise<FacebookAdAccount> {
    const response = await api.post<FacebookAdAccount>(`/facebook/brands/${brandId}/ad-accounts`, data);
    return response.data;
  }
}
```

## 2. Criar Componente AdAccountSelect

Local: `front/src/components/brands/AdAccountSelect.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { facebookService, FacebookAdAccount } from '@/services/facebook';

interface AdAccountSelectProps {
  brandId: number;
  onAccountSelect?: (success: boolean) => void;
}

export function AdAccountSelect({ brandId, onAccountSelect }: AdAccountSelectProps) {
  const [accounts, setAccounts] = useState<FacebookAdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setLoading(true);
      setError(null);
      const data = await facebookService.getAvailableAdAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Erro ao carregar contas de anúncio');
      onAccountSelect?.(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(accountId: string) {
    try {
      setError(null);
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) return;

      await facebookService.connectAdAccount(brandId, {
        accountId: account.account_id,
        accountName: account.name,
        businessId: account.business?.id || undefined
      });

      onAccountSelect?.(true);
    } catch (err) {
      setError('Erro ao vincular conta de anúncio');
      onAccountSelect?.(false);
    }
  }

  if (loading) {
    return <Select disabled placeholder="Carregando contas..." />;
  }

  return (
    <div>
      <Select
        placeholder="Selecione uma conta de anúncio"
        onChange={handleSelect}
        error={error}
      >
        {accounts.map((account) => (
          <Select.Option key={account.id} value={account.id}>
            {account.name}
          </Select.Option>
        ))}
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
```

## 3. Uso do Componente

O componente pode ser usado em qualquer lugar que precise vincular uma conta de anúncio a uma marca:

```typescript
<AdAccountSelect 
  brandId={currentBrand.id}
  onAccountSelect={(success) => {
    if (success) {
      // Atualizar estado/UI conforme necessário
    }
  }}
/>
```

## Notas de Implementação

1. Manter tratamento de erros simples e claro
2. Loading state para feedback visual
3. Callback para notificar sucesso/erro
4. Usar tipos consistentes com o backend
5. Componente autocontido e reutilizável