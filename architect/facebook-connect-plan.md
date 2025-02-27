# Plano de Implementação: Conexão de Marca com Facebook Business

## Controle de Versão

1. Criar nova branch a partir da develop:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/facebook-connect
```

2. Workflow de desenvolvimento:
   - Commits atômicos e descritivos
   - Testes antes de cada commit
   - Pull request para develop ao finalizar
   - Code review antes do merge

## Implementação do Facebook Login

### 1. Configuração do SDK

Adicionar SDK do Facebook no `front/src/app/layout.tsx`:
```typescript
// Inicialização do SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v19.0'
  });
};

// Carregar SDK
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
```

### 2. Componentes Frontend

#### FacebookConnectButton
Localização: `front/src/components/brands/FacebookConnect/index.tsx`

Funcionalidades:
- Login com popup
- Verificação de status de login
- Solicitação de permissões necessárias
- Gerenciamento de resposta do login

```typescript
interface FacebookLoginResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain: string;
    data_access_expiration_time: number;
  };
  status: 'connected' | 'not_authorized' | 'unknown';
}
```

Permissões requeridas:
- business_management
- ads_management
- ads_read

### 3. Backend Integration

1. Endpoints:
```typescript
// POST /api/facebook/validate-token
interface ValidateTokenRequest {
  accessToken: string;
}

// POST /api/facebook/connect-account
interface ConnectAccountRequest {
  brandId: number;
  accessToken: string;
  accountId: string;
}
```

2. Validação de Token:
- Verificar validade do token
- Verificar permissões concedidas
- Validar escopo do token

### 4. Fluxo de Login

1. Usuário clica no botão de conexão
2. Iniciar login do Facebook:
```typescript
FB.login(function(response) {
  if (response.authResponse) {
    // Token obtido com sucesso
    const accessToken = response.authResponse.accessToken;
    
    // Solicitar permissões adicionais se necessário
    FB.api('/me/permissions', function(permResponse) {
      // Verificar permissões concedidas
    });
    
    // Obter contas de anúncio
    FB.api('/me/adaccounts', function(accountsResponse) {
      // Selecionar conta para conexão
    });
  }
}, {
  scope: 'business_management,ads_management,ads_read',
  return_scopes: true
});
```

3. Processar resposta:
- Validar token no backend
- Conectar conta à marca
- Atualizar UI

### 5. Tratamento de Erros

1. Erros comuns:
- Login cancelado pelo usuário
- Permissões não concedidas
- Token inválido
- Erro na API do Facebook

2. Feedback ao usuário:
- Mensagens claras de erro
- Estados de loading
- Opções de retry

### 6. Testes

1. Testes unitários:
- Componente FacebookConnectButton
- Serviços de integração
- Handlers de erro

2. Testes de integração:
- Fluxo completo de login
- Validação de token
- Conexão de conta

3. Testes E2E:
- Fluxo do usuário completo
- Casos de erro
- Diferentes dispositivos/browsers

### 7. Segurança

1. Frontend:
- Sanitização de dados
- Validação de respostas
- Proteção contra CSRF

2. Backend:
- Validação de tokens
- Rate limiting
- Logs de segurança

## Checklist de Implementação

1. Setup:
- [ ] Criar branch feature/facebook-connect
- [ ] Configurar variáveis de ambiente
- [ ] Instalar SDK do Facebook

2. Frontend:
- [ ] Implementar FacebookConnectButton
- [ ] Integrar na página de marcas
- [ ] Adicionar tratamento de erros
- [ ] Implementar feedback visual

3. Backend:
- [ ] Implementar validação de token
- [ ] Criar endpoint de conexão
- [ ] Adicionar logs e monitoramento

4. Testes:
- [ ] Escrever testes unitários
- [ ] Executar testes de integração
- [ ] Realizar testes E2E

5. Documentação:
- [ ] Atualizar README
- [ ] Documentar endpoints
- [ ] Criar guia de troubleshooting

6. Deploy:
- [ ] Code review
- [ ] Pull request para develop
- [ ] Merge após aprovação

## Métricas de Sucesso

1. Performance:
- Tempo médio de login < 3s
- Taxa de sucesso > 95%
- Taxa de erro < 5%

2. UX:
- Feedback claro ao usuário
- Processo intuitivo
- Recuperação de erros eficiente

## Próximos Passos

1. Setup inicial:
```bash
git checkout -b feature/facebook-connect
```

2. Configuração do ambiente:
- Adicionar variáveis no .env
- Instalar dependências necessárias
- Configurar SDK do Facebook

3. Início da implementação pelo frontend:
- Criar componente base
- Implementar lógica de login
- Integrar com página de marcas