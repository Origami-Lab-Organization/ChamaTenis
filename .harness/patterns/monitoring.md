# Pattern — Monitoramento (ChamaTenis)

Projeto interno pequeno — monitoramento é deliberadamente leve nesta fase
(MVP, Sprint 1-2). Não adicione ferramenta de observabilidade pesada
(Datadog, Sentry pago, etc.) sem decisão explícita — registre um ADR se
isso mudar.

## O que existe

- Logs do Fastify (Pino), visíveis no painel do Railway.
- Logs de build/deploy do Railway.

## Sinais que valem atenção

- Falha de conexão com o Postgres no boot (env var errada, banco fora do
  ar).
- Erro 5xx recorrente em algum endpoint — investigar via log do Railway.
- Token de convite gerando erro no aceite (MATCH-5) — sintoma comum: token
  já usado ou expirado.

## Quando evoluir

- Se o uso real crescer além do time interno, considerar um endpoint de
  health-check (`GET /health`) e, só então, uma ferramenta de erro (ex.:
  Sentry free tier) — documentar a decisão em ADR antes de adicionar
  dependência nova.
