# Plano de Integração Frontend com Nova API Facebook

## Objetivo
Adaptar o frontend para utilizar a nova API do Facebook que será implementada no backend, removendo todas as chamadas diretas à API do Facebook do cliente.

## Mudanças Necessárias

### 1. Remover Dependências Facebook

#### 1.1 Arquivos a Serem Removidos
- `front/src/components/FacebookSDKProvider/index.tsx`
- `front/src/hooks/useFacebookSDK.ts`

#### 1.2 Configurações a Serem Atualizadas
- Remover configurações do Facebook do `.env`
- Atualizar `package.json` removendo dependências não utilizadas

### 2. Atualizar Serviços

#### 2.1 Novo Serviço Facebook
```typescript
// front/src/services/facebook.ts
import { api } from '@/lib/api';
import { FacebookMetrics } from '@/types/facebook';

interface DateRange {
  start: string;
  end: string;
}

export const facebookService = {
  // Métricas da conta
  async getMetrics(brandId: number, dateRange: DateRange) {
    const { data } = await api.get<FacebookMetrics>(`/facebook/metrics/${brandId}`, {
      params: { dateRange }
    });
    return data;
  },

  // Dados em tempo real
  async getRealtimeData(brandId: number) {
    const { data } = await api.get(`/facebook/realtime/${brandId}`);
    return data;
  },

  // Insights históricos
  async getHistoricalInsights(brandId: number, dateRange: DateRange) {
    const { data } = await api.get(`/facebook/insights/${brandId}`, {
      params: { dateRange }
    });
    return data;
  }
};
```

### 3. Atualizar Componentes

#### 3.1 DashboardCharts
```typescript
// Atualizar para usar o novo serviço
import { facebookService } from '@/services/facebook';
import { useBrand } from '@/contexts/BrandContext';

export function DashboardCharts() {
  const { selectedBrand } = useBrand();
  const [metrics, setMetrics] = useState<FacebookMetrics | null>(null);

  useEffect(() => {
    if (selectedBrand?.id) {
      facebookService.getMetrics(selectedBrand.id, {
        start: '2024-01-01',
        end: '2024-12-31'
      }).then(setMetrics);
    }
  }, [selectedBrand]);

  // Renderização do componente
}
```

#### 3.2 FacebookConnect
```typescript
// Simplificar para usar apenas o processo de autenticação do backend
export function FacebookConnect() {
  const startAuth = () => {
    window.location.href = '/api/facebook/auth/start';
  };

  return (
    <Button onClick={startAuth}>
      Conectar ao Facebook
    </Button>
  );
}
```

### 4. Tipos e Interfaces

#### 4.1 Atualizar Tipos Facebook
```typescript
// front/src/types/facebook.ts
export interface FacebookMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  reach: number;
}

export interface DateRange {
  start: string;
  end: string;
}
```

### 5. Contextos

#### 5.1 Remover FacebookContext
- Remover `front/src/contexts/FacebookContext.tsx`
- Atualizar `Providers` para remover referência ao FacebookContext

#### 5.2 Atualizar BrandContext
```typescript
// Simplificar para focar apenas em marcas e suas conexões
interface BrandContextType {
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  refetchBrands: () => Promise<void>;
}
```

## Ordem de Implementação

1. **Preparação**
   - Fazer backup das configurações atuais
   - Criar branch para as alterações

2. **Remoção de Código**
   - Remover componentes Facebook não utilizados
   - Remover hooks não utilizados
   - Limpar configurações

3. **Implementação dos Novos Serviços**
   - Criar novo serviço Facebook
   - Atualizar tipos e interfaces
   - Implementar chamadas à nova API

4. **Atualização dos Componentes**
   - Atualizar DashboardCharts
   - Atualizar FacebookConnect
   - Remover referências antigas

5. **Testes**
   - Testar fluxo de conexão
   - Testar exibição de métricas
   - Testar recuperação de erros

6. **Limpeza Final**
   - Remover imports não utilizados
   - Atualizar documentação
   - Revisar código

## Observações Importantes

1. Manter compatibilidade durante a transição
2. Implementar tratamento de erros adequado
3. Considerar estados de loading para melhor UX
4. Documentar todas as alterações
5. Realizar testes extensivos antes do deploy

## Próximos Passos

1. Revisar plano com a equipe
2. Definir cronograma de implementação
3. Criar tasks no sistema de gestão
4. Iniciar implementação por fase
5. Realizar testes de integração
6. Deploy em ambiente de staging
7. Validação final
8. Deploy em produção