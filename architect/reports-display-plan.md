# Plano para Exibição da Página de Relatórios com Dados Mockados

## Objetivo
Exibir a página de relatórios funcionando apenas com dados mockados, removendo verificações desnecessárias de backend.

## Mudanças Necessárias

### 1. Página de Relatórios (relatorios/page.tsx)
- Remover dependência do AuthContext
- Remover dependência do AccountContext
- Remover verificações de token
- Remover verificações de selectedAccount
- Manter apenas o estado local para configuração do relatório
- Renderizar diretamente os componentes ReportConfig e CustomReport

### 2. Implementação

```typescript
// Estrutura simplificada da página
export default function Relatorios() {
    const [config, setConfig] = useState({
        metrics: [
            { id: "1", name: "Orçamento", key: "budget", format: "currency" },
            // ... outras métricas
        ],
        dateRange: {
            from: undefined,
            to: undefined,
        },
        status: "all",
    });

    return (
        <div className="flex-1 p-6">
            <div className="main-container space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Relatórios</h1>
                </div>

                <ReportConfig onConfigChange={setConfig} />
                <CustomReport 
                    metrics={config.metrics}
                    dateRange={config.dateRange}
                    status={config.status}
                />
            </div>
        </div>
    );
}
```

## Próximos Passos
1. Trocar para o modo Code
2. Modificar a página de relatórios removendo as dependências do backend
3. Testar a renderização da página
4. Verificar se os filtros e configurações estão funcionando corretamente

## Observações
- Os dados mockados já existentes no CustomReport serão mantidos
- A página deve funcionar sem necessidade de autenticação ou conta selecionada
- Todas as funcionalidades de filtro e exibição devem continuar funcionando normalmente