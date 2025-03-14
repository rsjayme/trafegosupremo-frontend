# Estrutura Final do Módulo de Clientes no Núcleo de Gestão

## Estrutura de Arquivos

```
/src/
├── app/
│   └── (authenticated)/
│       └── nucleo-gestao/
│           ├── layout.tsx
│           ├── page.tsx
│           ├── leads/
│           └── clients/
│               ├── page.tsx
│               └── [id]/
│                   └── edit/
│                       └── page.tsx
├── components/
│   └── clients/
│       ├── clients-table.tsx
│       └── clients-filters.tsx
├── services/
│   └── clients.ts
├── hooks/
│   └── useClients.ts
└── lib/
    ├── axios.ts
    └── utils.ts
```

## Ações Necessárias

1. Mover os arquivos implementados para a estrutura correta:
   - Mover `/app/nucleo-gestao/clients/*` para `/app/(authenticated)/nucleo-gestao/clients/*`

2. Atualizar todas as referências de rotas nos componentes:
   - Atualizar link "Voltar" na página de edição
   - Atualizar link "Novo Cliente" na página de listagem
   - Atualizar links no menu de navegação do layout

3. Remover arquivos não utilizados:
   - Remover `/app/clients/*`
   - Remover `/app/nucleo-gestao/*`

4. Instalar componentes do shadcn necessários
   - Executar script setup-components.sh

## Observações

- A pasta (authenticated) é um grupo de rotas do Next.js que agrupa todas as páginas que requerem autenticação
- O módulo de Clientes segue a mesma estrutura do módulo de Leads que já existe
- Os componentes compartilhados ficam na pasta components/clients
- Os serviços e hooks ficam nas suas respectivas pastas no nível raiz do src