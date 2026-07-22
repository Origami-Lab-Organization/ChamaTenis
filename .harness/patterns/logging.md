# Pattern — Logging (ChamaTenis)

## Backend

- Usar o logger nativo do Fastify (Pino) — nunca `console.log` em código de
  negócio.
- Log de erro inclui contexto acionável (rota, tipo de erro) — nunca o
  payload completo da request (pode conter senha).
- Nunca logar: senha (mesmo hash), token JWT, token de convite,
  `DATABASE_URL`.

## Frontend

- Erro de chamada de API mostra mensagem amigável para o usuário
  (toast/estado de erro na tela) — detalhe técnico só no console em dev,
  nunca em produção.

## Regra geral

- Mensagem de log/erro diz o que aconteceu e, quando fizer sentido, o que
  fazer — não só "Error" ou stack trace cru para o usuário final.
