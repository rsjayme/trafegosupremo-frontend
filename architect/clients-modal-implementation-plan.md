# Plano de Implementação do Modal de Clientes

## 1. Estrutura de Arquivos

```
/src/components/gestao/clients/
├── ClientFormDialog.tsx       # Modal com formulário de cliente
└── DateTimePicker.tsx        # Componente de data/hora (reutilizar do leads)
```

## 2. Implementação do Schema

```typescript
// /src/lib/schemas/client.ts
import { z } from 'zod';

export const clientSchema = z.object({
  status: z.enum(['ATIVO', 'INATIVO']),
  responsibleName: z.string().min(1, 'Nome do responsável é obrigatório'),
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  value: z.number().nullable(),
  email: z.string().email('Email inválido').nullable(),
  phone: z.string().nullable(),
  observations: z.string().nullable(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
```

## 3. Componente ClientFormDialog

### Interface
```typescript
interface ClientFormDialogProps {
  trigger: React.ReactNode;
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
}
```

### Funcionalidades
- Modal usando o Dialog do shadcn
- Formulário usando react-hook-form + zod
- Campos:
  - Status (Select)
  - Nome do Responsável (Input)
  - Nome da Empresa (Input)
  - Valor (Input com formatação de moeda)
  - Email (Input)
  - Telefone (Input com máscara)
  - Observações (Textarea)
- Validação de campos obrigatórios
- Formatação de valores monetários
- Máscaras de telefone

## 4. Atualização da Página Principal

### Remover
- Rota de edição (/clients/[id]/edit)
- Layout específico de clients

### Atualizar
```typescript
export default function ClientsPage() {
  // ... estados existentes ...

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="font-medium">Gestão de Clientes</h1>
        <ClientFormDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          }
          onSubmit={createClient.mutateAsync}
        />
      </div>
      {/* ... restante do conteúdo ... */}
    </div>
  );
}
```

## 5. Atualização da Tabela

### Ações do Cliente
```typescript
<DropdownMenuItem
  onClick={() => {
    // Abrir modal de edição com dados do cliente
  }}
>
  <Pencil className="mr-2 h-4 w-4" />
  Editar
</DropdownMenuItem>
```

## 6. Fluxo de Dados
1. Criar/Editar:
   - Abrir modal via trigger
   - Preencher formulário
   - Validar dados
   - Enviar para API
   - Fechar modal e atualizar lista

## 7. Próximos Passos
1. Implementar schema do cliente
2. Criar componente ClientFormDialog
3. Atualizar página principal
4. Remover arquivos não utilizados
5. Testar fluxo completo
6. Ajustar estilos e responsividade