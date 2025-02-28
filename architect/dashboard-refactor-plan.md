# Plano de Refatoração do Dashboard

## Problema Atual
- Temos dois contextos (AccountContext e BrandContext) gerenciando informações similares
- AccountContext está usando dados mockados
- Verificação de conta conectada está inconsistente entre os componentes
- Mensagens diferentes para o mesmo estado (conta não conectada)

## Solução Proposta

### 1. Remover AccountContext
- Remover AccountContext.tsx
- Remover referências ao AccountContext em todos os componentes
- Consolidar toda a lógica de gerenciamento de contas no BrandContext

### 2. Atualizar BrandContext
```typescript
interface Brand {
    id: number;
    name: string;
    userId: number;
    facebookAccount: FacebookAccount | null;
}

interface BrandContextType {
    selectedBrand: Brand | null;
    setSelectedBrand: (brand: Brand | null) => void;
    brands: Brand[];
    isLoading: boolean;
    error: string | null;
    refetchBrands: () => Promise<void>;
    hasConnectedAccount: boolean; // Nova propriedade
}
```

### 3. Atualizar Página do Dashboard
```typescript
export default function Dashboard() {
    const { selectedBrand, hasConnectedAccount } = useBrand();

    if (!hasConnectedAccount) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">
                            Conecte uma conta de anúncios do Facebook para visualizar suas métricas.
                        </p>
                        <Button onClick={() => router.push("/marcas")}>
                            Configurar Conta
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6">
            <DashboardContent brand={selectedBrand} />
        </div>
    );
}
```

### 4. Atualizar DashboardCharts
- Remover verificações redundantes de conta
- Usar props do componente para receber dados da marca
- Mover lógica de filtragem para um nível acima

### 5. Fluxo de Dados
1. BrandContext carrega marcas com contas conectadas
2. Header exibe dropdown apenas com marcas válidas
3. Dashboard verifica estado de conexão através do BrandContext
4. Componentes recebem dados via props ao invés de acessar contexto

## Sequência de Implementação

1. Criar branch feature/dashboard-refactor
2. Adicionar nova propriedade hasConnectedAccount ao BrandContext
3. Atualizar página do Dashboard
4. Remover AccountContext
5. Atualizar DashboardCharts
6. Atualizar outros componentes que dependiam do AccountContext
7. Testar fluxo completo
8. Revisar e padronizar mensagens de erro/status

## Melhorias Adicionais

1. Cache de seleção de marca
```typescript
// Salvar última marca selecionada
useEffect(() => {
    if (selectedBrand) {
        localStorage.setItem('lastSelectedBrand', selectedBrand.id.toString());
    }
}, [selectedBrand]);

// Recuperar última marca selecionada
useEffect(() => {
    const lastBrandId = localStorage.getItem('lastSelectedBrand');
    if (lastBrandId && brands.length > 0) {
        const lastBrand = brands.find(b => b.id.toString() === lastBrandId);
        if (lastBrand) setSelectedBrand(lastBrand);
    }
}, [brands]);
```

2. Estado de Loading Aprimorado
- Adicionar estados de loading mais granulares
- Feedback visual consistente durante carregamento

3. Tratamento de Erros
- Mensagens de erro mais descritivas
- Opções de retry quando apropriado
- Log de erros para debugging