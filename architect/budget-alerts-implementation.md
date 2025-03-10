# Plano de Implementação: Tela de Alertas de Orçamento

## Objetivo
Criar uma interface para gerenciar alertas de orçamento por marca, permitindo configurar limites de gastos e webhooks do Discord para notificações.

## 1. Estrutura de Arquivos

```
front/src/
  ├── app/
  │   └── (authenticated)/
  │       └── alertas/
  │           ├── page.tsx
  │           └── components/
  │               ├── alert-form.tsx
  │               └── alert-list.tsx
  │
  ├── components/
  │   └── sidebar/
  │       └── index.tsx (atualizar)
  │
  ├── services/
  │   └── budget-alerts.ts
  │
  └── types/
      └── budget-alerts.ts
```

## 2. Componentes Necessários

### 2.1 Sidebar
Adicionar novo item:
```tsx
{
    label: "Alertas de Orçamento",
    icon: Bell,
    href: "/alertas",
}
```

### 2.2 Página Principal (page.tsx)
- Header com título e botão de criar novo alerta
- Tabela de alertas existentes
- Modal/Dialog para criar/editar alertas

### 2.3 Formulário de Alerta (alert-form.tsx)
Campos necessários:
- Seletor de marca (Select do Radix)
- Valor limite (Input numérico)
- Data inicial (DatePicker)
- URL do webhook Discord (Input)
- Status (ativo/inativo)

### 2.4 Lista de Alertas (alert-list.tsx)
Colunas da tabela:
- Marca
- Valor Limite
- Data Inicial
- Status
- Ações (editar/excluir)

## 3. Integração com API

### 3.1 Tipos
```typescript
interface BudgetAlert {
  id: number;
  brandId: number;
  threshold: number;
  startDate: string;
  webhookUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface CreateBudgetAlertDTO {
  brandId: number;
  threshold: number;
  startDate: string;
  webhookUrl: string;
}

interface UpdateBudgetAlertDTO {
  threshold?: number;
  webhookUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
```

### 3.2 Serviço (budget-alerts.ts)
```typescript
export const budgetAlertsService = {
  list: (brandId: number) => 
    api.get<BudgetAlert[]>(`/budget-alerts/brand/${brandId}`),
    
  create: (data: CreateBudgetAlertDTO) => 
    api.post<BudgetAlert>('/budget-alerts', data),
    
  update: (id: number, data: UpdateBudgetAlertDTO) => 
    api.put<BudgetAlert>(`/budget-alerts/${id}`, data),
    
  delete: (id: number) => 
    api.delete(`/budget-alerts/${id}`),
};
```

### 3.3 React Query Hooks
```typescript
export function useAlerts(brandId: number) {
  return useQuery({
    queryKey: ['alerts', brandId],
    queryFn: () => budgetAlertsService.list(brandId),
  });
}

export function useCreateAlert() {
  return useMutation({
    mutationFn: budgetAlertsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
```

## 4. Ordem de Implementação

1. Criar tipos e serviço de API
2. Adicionar item na sidebar
3. Criar estrutura básica da página
4. Implementar formulário de criação/edição
5. Implementar listagem de alertas
6. Adicionar funcionalidade de edição
7. Adicionar funcionalidade de exclusão
8. Implementar feedback visual (loading states, toasts)

## 5. Considerações de UX

1. Validações de Formulário:
   - Valor limite deve ser positivo
   - URL do webhook deve ser válida
   - Data inicial não pode ser no passado

2. Feedback ao Usuário:
   - Loading states durante operações
   - Mensagens de sucesso/erro via toast
   - Confirmação antes de excluir

3. Responsividade:
   - Tabela com scroll horizontal em telas menores
   - Modal adaptativo para diferentes tamanhos de tela

## 6. Integração com Contexto Existente

1. Usar o contexto de marcas existente para o seletor
2. Integrar com o sistema de autenticação atual
3. Manter consistência visual com os outros módulos
4. Reutilizar componentes de UI existentes

## 7. Testes e Validação

1. Testar integração com API
2. Validar permissões de acesso
3. Testar diferentes cenários de uso
4. Verificar feedback visual