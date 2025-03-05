# Plano de Implementação: Seleção Múltipla de Campanhas nos Widgets

## Visão Geral do Fluxo de Dados

```mermaid
graph TD
    A[Página de Relatórios] --> B[ReportsCanvas]
    B --> C[WidgetCard]
    C --> D[Dialog de Configuração]
    D --> E[Seleção de Campanhas]
    
    subgraph "Fluxo de Dados"
        F[Facebook Insights API] --> G[Dados brutos]
        G --> H[Agregação de métricas]
        H --> I[Renderização no Widget]
    end
```

## 1. Modificações na Interface de Widget

```mermaid
classDiagram
    class Widget {
        id: string
        type: string
        title: string
        position: Position
        size: Size
        config: WidgetConfig
    }
    
    class WidgetConfig {
        level: "account" | "campaign"
        metrics?: string[]
        demographic?: string
        funnelMetrics?: string[]
        campaignIds?: string[] // Nova propriedade
        dateRange: DateRange
    }
```

## 2. Alterações Necessárias

### a) Estrutura de Dados
- Modificar a interface `Widget` para suportar múltiplas campanhas
- Alterar `campaignId` para `campaignIds` como array de strings
- Atualizar as funções de agregação para processar múltiplas campanhas

### b) Componentes UI
- Atualizar o componente de seleção de campanha para permitir múltipla seleção
- Implementar um componente de multi-select com checkboxes
- Adicionar indicadores visuais das campanhas selecionadas

### c) Lógica de Agregação
- Modificar a função `aggregateOverviewMetrics` para somar métricas de múltiplas campanhas
- Atualizar a função `aggregateDailyMetrics` para combinar dados diários de múltiplas campanhas
- Implementar validação para garantir soma correta de métricas

## 3. Etapas de Implementação

```mermaid
graph LR
    A[1. Estrutura] --> B[2. UI]
    B --> C[3. Lógica]
    C --> D[4. Testes]
    
    subgraph "1. Estrutura"
        A1[Atualizar interfaces]
        A2[Modificar tipos]
    end
    
    subgraph "2. UI"
        B1[Multi-select component]
        B2[UI feedback]
    end
    
    subgraph "3. Lógica"
        C1[Funções de agregação]
        C2[Processamento de dados]
    end
    
    subgraph "4. Testes"
        D1[Testes unitários]
        D2[Testes de integração]
    end
```

## 4. Detalhes da Implementação

### a) Alterações no ReportsCanvas
- Atualizar a lógica de filtragem para considerar múltiplas campanhas
- Modificar a agregação de métricas para somar dados de todas as campanhas selecionadas
- Implementar validações para evitar duplicação de dados

### b) Modificações no WidgetCard
- Atualizar o componente de configuração para suportar seleção múltipla
- Implementar UI para mostrar campanhas selecionadas
- Adicionar validações para seleção de campanhas

### c) Atualizações no Serviço de Dados
- Modificar funções de processamento para lidar com múltiplas campanhas
- Implementar novas funções de agregação quando necessário
- Atualizar a lógica de cálculo de métricas

## 5. Considerações Importantes
- Manter a performance ao agregar dados de múltiplas campanhas
- Garantir que as métricas calculadas (CTR, CPC, etc.) sejam precisas
- Implementar feedback visual claro sobre quais campanhas estão selecionadas
- Adicionar validações para prevenir erros de dados