# Plano de Implementação: Tela de Criação de Marcas com Integração Facebook

## Visão Geral

Implementar uma nova tela no frontend para criação de marcas (brands) com a possibilidade de conectar diretamente com uma conta do Facebook através do SDK oficial.

## Estrutura de Arquivos

```
front/src/app/marcas/
├── page.tsx                    # Listagem de marcas
├── criar/
│   └── page.tsx               # Tela de criação de marca
└── [id]/
    └── page.tsx               # Detalhes da marca

front/src/components/brands/
├── BrandForm/
│   └── index.tsx              # Formulário de criação/edição
└── FacebookConnect/
    └── index.tsx              # Componente de conexão com Facebook

# Outras páginas (ajuste de estrutura)
front/src/app/
├── campanhas/
├── relatorios/
└── configuracoes/
```

## Fluxo de Criação

1. **Criação Inicial da Marca**
   - Usuário preenche nome da marca
   - Sistema cria registro da marca via API
   - Retorna ID da marca criada

2. **Conexão com Facebook**
   - Exibir botão "Conectar com Facebook"
   - Ao clicar, abre popup do Facebook Login
   - Solicitar permissões necessárias:
     - `ads_management`
     - `ads_read`
     - `read_insights`
   - Receber token de acesso e ID da conta
   - Enviar dados para backend via endpoint de conexão

## Componentes Necessários

### BrandForm
- Campo para nome da marca
- Validação de campos obrigatórios
- Feedback visual de erro/sucesso
- Integração com API de criação

### FacebookConnect
- Implementar SDK do Facebook
- Botão de conexão personalizado
- Tratamento de erros de autenticação
- Loading states
- Feedback visual do status da conexão

## APIs Necessárias

### Backend (já implementadas)
```typescript
// Criar marca
POST /api/brands
Body: { name: string }

// Conectar Facebook
POST /api/facebook/connect
Body: {
  brandId: number,
  accessToken: string,
  accountId: string
}
```

## Passos de Implementação

1. **Preparação**
   - Adicionar SDK do Facebook no layout.tsx
   - Configurar variáveis de ambiente para Facebook App ID
   - Ajustar estrutura de rotas removendo prefixo /dashboard

2. **Componentes**
   - Implementar BrandForm
   - Implementar FacebookConnect
   - Criar páginas de listagem e criação

3. **Integração**
   - Implementar serviços de API
   - Adicionar tratamento de erros
   - Implementar feedback visual

4. **Testes**
   - Testar fluxo de criação
   - Testar integração com Facebook
   - Validar tratamento de erros

## Considerações de UX

- Mostrar loading states apropriados
- Feedback claro em cada etapa
- Mensagens de erro amigáveis
- Processo de criação em etapas
- Confirmações visuais de sucesso

## Segurança

- Validar tokens do Facebook no backend
- Sanitizar inputs
- Proteger rotas com autenticação
- Validar permissões do usuário

## Próximos Passos

1. Refatorar estrutura de rotas
   - Mover /dashboard/campanhas para /campanhas
   - Mover /dashboard/relatorios para /relatorios
   - Mover /dashboard/configuracoes para /configuracoes

2. Implementar nova estrutura
   - Criar estrutura base de arquivos para marcas
   - Implementar formulário de criação
   - Integrar SDK do Facebook
   - Implementar fluxo de conexão

3. Finalização
   - Adicionar testes
   - Revisar UX/UI
   - Validar navegação entre páginas