# Plano para Correção do Roteamento

## 1. Problemas Identificados
- Falta de layout específico para a seção dashboard
- Navegação entre páginas não está funcionando corretamente
- Proteção de rotas pode estar afetando a navegação

## 2. Soluções Propostas

### 2.1 Layout do Dashboard
Criar arquivo `dashboard/layout.tsx`:
```tsx
- Wrapper para todas as páginas do dashboard
- Incluir Sidebar para navegação
- Verificação de autenticação
- Loading states
- Redirect para login se não autenticado
```

### 2.2 Ajustes no Middleware
- Verificar se o token está sendo armazenado corretamente
- Ajustar nome do cookie para `auth_token`
- Garantir que as rotas públicas estão corretas
- Adicionar mais rotas na lista de exceções se necessário

### 2.3 Navegação e Links
- Implementar navegação programática correta
- Usar next/link para navegação entre páginas
- Garantir que URLs estão corretas no Sidebar
- Adicionar estados ativos para itens do menu

### 2.4 Estrutura de Páginas
```
/dashboard
  ├── layout.tsx         # Layout compartilhado
  ├── page.tsx           # Página principal
  ├── campanhas/
  │   └── page.tsx      # Lista de campanhas
  ├── relatorios/
  │   └── page.tsx      # Relatórios
  └── configuracoes/
      └── page.tsx      # Configurações
```

## 3. Ordem de Implementação

1. Criar layout do dashboard
   - Implementar estrutura base
   - Adicionar Sidebar
   - Configurar proteção de rota
   - Adicionar loading states

2. Ajustar middleware
   - Verificar nomes de cookies
   - Atualizar lista de rotas públicas
   - Testar redirecionamentos

3. Atualizar componentes de navegação
   - Corrigir links no Sidebar
   - Implementar estados ativos
   - Adicionar feedback visual

4. Testar e validar
   - Verificar fluxo de autenticação
   - Testar navegação entre páginas
   - Validar proteção de rotas
   - Confirmar redirecionamentos

## 4. Considerações de Segurança

- Garantir que todas as rotas do dashboard estão protegidas
- Validar token em cada requisição
- Implementar logout adequado
- Limpar dados sensíveis ao sair

## 5. Melhorias de UX

- Adicionar loading states durante navegação
- Feedback visual para rotas ativas
- Transições suaves entre páginas
- Mensagens de erro claras

## 6. Testes Necessários

1. Fluxo de autenticação
   - Login → Dashboard
   - Acesso não autorizado → Login
   - Logout → Login

2. Navegação
   - Entre todas as páginas do dashboard
   - Botão voltar do navegador
   - Links diretos (deep linking)

3. Estados de erro
   - Token inválido
   - Sessão expirada
   - Erro de rede