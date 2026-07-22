# Pattern — Testes (ChamaTenis)

## Teste faz parte da entrega (ADR-031 do harness-core)

- Todo comportamento de produção criado ou alterado (endpoint, service,
  regra de negócio) recebe teste no mesmo diff/história.
- Falta de teste criada pela história atual não é dívida técnica — é
  trabalho incompleto. Não abra TD, não use `TODO`/`it.todo` para adiar.
- Dívida de teste só cabe para lacuna preexistente fora do escopo da
  história atual.

## Backend (Fastify + Prisma)

- Teste de service/regra de negócio: unitário, mockando o Repository (sem
  bater no banco).
- Teste de endpoint (Controller): sobe o Fastify via `app.inject()`
  (nativo do Fastify, sem precisar de servidor HTTP real).
- Teste de Repository (acesso a dados via Prisma): roda contra um Postgres
  real de teste (banco local via Docker, ou instância de teste separada) —
  nunca mock do Prisma Client nessa camada, senão não valida a query de
  fato.
- Sem número fixo de cobertura neste projeto (é aprendizado) — a régua é
  "todo endpoint e toda regra de negócio da história tem teste", não uma %
  de cobertura agregada.

## Frontend (React)

- Testar comportamento (o que o usuário vê/faz), não detalhe de
  implementação — Testing Library sobre teste de snapshot raso.
- Tela que consome API trata explicitamente loading/empty/error — e isso
  tem teste.

## Como rodar

- Documentar aqui os scripts (`npm test` etc.) assim que SETUP-1 definir o
  `package.json` de `api/` e `web/`.
