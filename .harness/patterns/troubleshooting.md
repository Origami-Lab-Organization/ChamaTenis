# Pattern — Troubleshooting (ChamaTenis)

## `prisma migrate dev` falha

1. Confirmar que `DATABASE_URL` no `.env` local aponta para um Postgres
   acessível (Railway ou local).
2. Confirmar que o Postgres está no ar.
3. Ver se o schema tem erro de sintaxe (`npx prisma validate`).

## API não sobe (`npm run dev` na pasta `api/`)

1. Confirmar `.env` com todas as variáveis exigidas na validação de boot
   (`DATABASE_URL`, `JWT_SECRET`).
2. Ver se a porta já está em uso.
3. Ver log do Fastify no terminal — geralmente aponta a variável faltante.

## Convite não funciona (MATCH-4/5)

1. Confirmar se o token já foi usado (uso único — ver
   `.harness/patterns/security.md`).
2. Confirmar se o link não expirou (se expiração foi implementada).
3. Testar o fluxo completo sem conta logada — deve cair no cadastro
   linkado à partida.

## Deploy no Railway falha

1. Ver log de build do Railway.
2. Confirmar variáveis de ambiente configuradas no painel do Railway
   (mesmas do `.env.example`).
3. Confirmar que a migration do Prisma roda no deploy (`prisma migrate
   deploy` no comando de start/build).

## Frontend não conecta na API

1. Confirmar a URL da API configurada no `web/` (env var do Vite,
   `VITE_API_URL`).
2. Confirmar CORS liberado no Fastify para a origem do frontend.
