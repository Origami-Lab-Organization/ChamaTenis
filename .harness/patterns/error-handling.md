# Pattern — Tratamento de Erros (ChamaTenis)

## Backend (Fastify)

- Service lança erro com significado (ex.: `EmailJaCadastradoError`,
  `CredenciaisInvalidasError`) — nunca `throw new Error('erro')` genérico
  para regra de negócio.
- Controller não monta resposta de erro na mão feature a feature — usa o
  `setErrorHandler` central do Fastify para traduzir erro conhecido em
  status HTTP (400/401/404/409); erro desconhecido cai em 500 genérico
  (sem stack trace para o cliente).
- Mensagem de erro para o cliente é clara e sem dado sensível (nunca stack
  trace, `DATABASE_URL` ou detalhe interno de query).
- Todo `catch` trata, loga com contexto seguro ou relança — nunca engole
  erro em silêncio.

## Frontend

- Chamada de API que falha mostra estado de erro para o usuário (nunca
  tela em branco ou só `console.error`).
- Erro 401 (token expirado/inválido) redireciona para o login.

## Categorias de erro esperadas neste projeto

- Validação de input (cadastro/login/criar partida) → 400
- Não autenticado / token inválido → 401
- Recurso não encontrado (partida, usuário, convite) → 404
- Conflito (email duplicado, convite já usado) → 409
