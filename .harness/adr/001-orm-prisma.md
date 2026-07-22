# ADR-001 — ORM Prisma

- Status: Aceito
- Data: 2026-07-22
- Responsável: Gabriel (Tech Lead)

## Contexto

O projeto precisa de um ORM para PostgreSQL em TypeScript/Node. Gabriel já
usa Prisma no projeto `api-rest-solid`, e o schema declarativo
(`schema.prisma`) é mais fácil de ensinar para o Lucas, que está no
primeiro projeto real dele.

## Decisão

Usar Prisma como ORM, com PostgreSQL hospedado no Railway.

## Consequências

- Migrations geradas por `prisma migrate dev`/`prisma migrate deploy`.
- Schema centralizado em `prisma/schema.prisma`.
- Lucas aprende um client tipado e gerado automaticamente a partir do
  schema.
- Diverge do padrão Drizzle usado em outros back-ends da Origami (ADR-021
  do harness-core) — decisão local do ChamaTenis, não do time todo.

## Alternativas Consideradas

- Drizzle: padrão de outros projetos do time, mas com configuração de
  schema/migrations mais manual — peso extra desnecessário para o primeiro
  projeto do Lucas.
- Knex/SQL puro: ensina SQL diretamente, mas sem tipagem automática — o
  trade-off não valia para o objetivo de ensinar camadas primeiro.
