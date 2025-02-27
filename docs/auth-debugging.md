# Guia de Depuração de Autenticação

## Ferramentas de Debug

Foram implementadas ferramentas de debug para ajudar na identificação e resolução de problemas de autenticação. Estas ferramentas estão disponíveis globalmente no console do navegador.

### Comandos Disponíveis

1. `debugAuth()`
   - Mostra informações detalhadas sobre o estado atual da autenticação
   - Exibe tokens armazenados no localStorage e cookies
   - Mostra dados do usuário
   - Inclui timestamp para rastreamento

2. `clearAuthDebug()`
   - Limpa todos os dados de autenticação
   - Remove tokens do localStorage e cookies
   - Útil para testar fluxos de login/logout

## Como Usar

1. Abra o DevTools do navegador (F12)
2. No console, execute `debugAuth()` para ver o estado atual
3. Verifique se os tokens estão presentes e consistentes
4. Use `clearAuthDebug()` para resetar o estado de autenticação

## Verificações Comuns

### 1. Token não está sendo salvo após login

```javascript
// Execute após tentar login
debugAuth()
// Verifique se aparece "✅ Present" para localStorage e cookies
```

### 2. Redirecionamento em loop

```javascript
// Limpe os dados e tente novamente
clearAuthDebug()
// Tente fazer login novamente
```

### 3. Verificar consistência dos tokens

```javascript
const info = debugAuth()
// Compare os tokens
console.log('Tokens são iguais:', 
  info.localStorage.token === info.cookies.token)
```

## Problemas Comuns e Soluções

1. Token presente em localStorage mas não em cookies
   - Limpe os dados com `clearAuthDebug()`
   - Faça logout e login novamente

2. Token inválido ou expirado
   - Verifique o console por erros 401
   - Use `clearAuthDebug()` e faça login novamente

3. Dados de usuário ausentes
   - Verifique se o token está correto
   - Tente recarregar a página

## Logs de Debug

O sistema registra automaticamente:
- Tentativas de login
- Respostas da API
- Erros de autenticação
- Mudanças no estado do token

## Melhorando a Depuração

1. Use os logs do console para rastrear o fluxo
2. Verifique a aba Network para requisições à API
3. Monitore os cookies na aba Application
4. Use breakpoints nos serviços de autenticação

## Notas Importantes

- Os tokens são armazenados tanto em localStorage quanto em cookies
- O sistema prioriza o token do cookie para autenticação
- Mudanças de rota podem causar revalidação do token
- O estado de loading previne interações durante verificações

## Próximos Passos

Se encontrar problemas persistentes:
1. Colete os logs usando `debugAuth()`
2. Capture screenshots do DevTools
3. Documente os passos para reproduzir
4. Reporte o problema com os dados coletados