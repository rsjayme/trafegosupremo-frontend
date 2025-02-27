# Plano de Refatoração de Rotas

## Visão Geral

Refatorar a estrutura de rotas do frontend para remover o prefixo /dashboard/ e manter todas as páginas principais no nível raiz.

## Mudanças Necessárias

### 1. Estrutura de Arquivos

De:
```
front/src/app/
├── dashboard/
│   ├── page.tsx
│   ├── campanhas/
│   ├── relatorios/
│   └── configuracoes/
└── login/
```

Para:
```
front/src/app/
├── page.tsx           # Dashboard principal
├── campanhas/        # Área de campanhas
├── relatorios/       # Área de relatórios
├── configuracoes/    # Área de configurações
├── marcas/          # Nova área de marcas
└── login/           # Mantém-se inalterado
```

### 2. Ajustes de Componentes

1. **Sidebar**
   - Atualizar links de navegação
   - Remover referências a /dashboard/
   - Manter estrutura de menu

2. **RouteGuard**
   - Atualizar lógica de proteção de rotas
   - Ajustar paths protegidos

3. **AuthRedirect**
   - Atualizar caminhos de redirecionamento

### 3. Passos da Refatoração

1. **Preparação**
   - Criar cópias de segurança dos arquivos
   - Identificar todas as referências a /dashboard/

2. **Migração de Arquivos**
   - Mover conteúdo de /dashboard/page.tsx para /page.tsx
   - Mover pastas de funcionalidades para raiz
   - Preservar componentes e lógica existentes

3. **Atualização de Referências**
   - Ajustar imports
   - Atualizar URLs de navegação
   - Corrigir links no Sidebar

4. **Testes**
   - Validar navegação
   - Testar proteção de rotas
   - Verificar redirecionamentos

### 4. Impacto em Outros Componentes

1. **Providers**
   - Verificar contextos que dependem de rotas
   - Ajustar paths de providers se necessário

2. **Header**
   - Atualizar links de navegação
   - Ajustar breadcrumbs se existirem

3. **Serviços**
   - Revisar URLs em chamadas de API
   - Atualizar constantes de rotas

## Considerações

### Segurança
- Manter proteção das rotas
- Preservar lógica de autenticação
- Garantir redirecionamentos seguros

### UX
- Manter consistência na navegação
- Evitar quebra de bookmarks
- Preservar estado atual das páginas

## Ordem de Implementação

1. Criar nova estrutura de arquivos
2. Migrar dashboard principal
3. Migrar páginas secundárias
4. Atualizar componentes de navegação
5. Testar fluxos completos
6. Remover estrutura antiga

## Validação

- Testar todos os fluxos de navegação
- Verificar proteção de rotas
- Validar redirecionamentos
- Testar persistência de estado
- Verificar compatibilidade com URLs salvas

## Rollback Plan

Em caso de problemas:
1. Manter estrutura antiga temporariamente
2. Implementar redirecionamentos de fallback
3. Reverter mudanças por funcionalidade