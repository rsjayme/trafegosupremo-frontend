# Plano de Implementação do Módulo de Clientes no Núcleo de Gestão

## Estrutura Atual
- `/nucleo-gestao/layout.tsx` - Layout base com navegação entre módulos (Leads e Clientes)
- Navegação já configurada para `/nucleo-gestao/clients`

## Estrutura a ser Implementada

### 1. Arquivos e Diretórios
```
/src/app/nucleo-gestao/
├── clients/
│   ├── page.tsx             # Página de listagem
│   ├── [id]/
│   │   └── edit/
│   │       └── page.tsx     # Página de edição/criação
```

### 2. Componentes Compartilhados
```
/src/components/clients/
├── clients-table.tsx       # Tabela de listagem
├── clients-filters.tsx     # Filtros de busca
```

### 3. Serviços e Hooks
```
/src/services/
└── clients.ts             # Serviço de API

/src/hooks/
└── useClients.ts         # Hook para gerenciamento de estado
```

## Implementação

### 1. Páginas

#### 1.1 Listagem (page.tsx)
- Tabela com listagem de clientes
- Filtros de busca
- Ações:
  - Criar novo cliente
  - Editar cliente
  - Inativar/Ativar cliente

#### 1.2 Edição ([id]/edit/page.tsx)
- Formulário de edição/criação
- Campos:
  - Status (Select)
  - Nome do Responsável
  - Nome da Empresa
  - Email
  - Telefone
  - Valor
  - Observações

### 2. Componentes

#### 2.1 ClientsTable
- Colunas:
  - Status
  - Nome do Responsável
  - Nome da Empresa
  - Email
  - Telefone
  - Valor
  - Ações
- Funcionalidades:
  - Paginação
  - Ordenação
  - Menu de ações por cliente

#### 2.2 ClientsFilters
- Busca por texto (nome, empresa, email)
- Filtro por status
- Ordenação

### 3. Serviços e Hooks

#### 3.1 ClientsService
- Endpoints:
  - GET /clients (listagem paginada)
  - GET /clients/:id (detalhes)
  - POST /clients (criação)
  - PATCH /clients/:id (atualização)

#### 3.2 useClients Hook
- Estados:
  - Lista de clientes
  - Loading states
  - Erros
- Mutations:
  - Criar cliente
  - Atualizar cliente
  - Atualizar status

## Bibliotecas Utilizadas
- shadcn/ui para componentes base
- @tanstack/react-query para estado
- react-hook-form para formulários
- zod para validação
- sonner para notificações

## Fluxo de Navegação
1. Usuário acessa Núcleo de Gestão
2. Seleciona "Clientes" no menu
3. Visualiza lista de clientes
4. Pode:
   - Filtrar clientes
   - Criar novo cliente
   - Editar cliente existente
   - Inativar/Ativar cliente

## Passos de Implementação
1. Setup inicial dos serviços e hooks
2. Implementação dos componentes base
3. Implementação da página de listagem
4. Implementação do formulário de edição
5. Testes e ajustes finais

## Considerações de UX
- Feedback visual para ações (toasts)
- Confirmação para inativação de cliente
- Loading states claros
- Validação de formulários
- Mensagens de erro amigáveis