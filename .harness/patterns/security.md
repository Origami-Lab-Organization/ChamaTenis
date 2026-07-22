# Pattern — Segurança (ChamaTenis)

## Senha

- Hash com bcrypt (custo mínimo 10) antes de persistir. Nunca logar,
  retornar em response ou comparar em texto puro fora do
  `bcrypt.compare`.
- Endpoint de cadastro (AUTH-2) retorna erro claro para email duplicado —
  nunca 500 genérico. Nunca vaza o hash da senha em nenhuma response.

## JWT

- Secret via env var (`JWT_SECRET`), validada no boot — o processo não sobe
  sem ela.
- Token carrega só o necessário para identificar o usuário (id) — nunca
  senha/hash.
- Expiração definida explicitamente (`exp`) — nunca token sem validade.

## Convite (token de partida)

- Token gerado com entropia suficiente (`crypto.randomUUID()` ou
  equivalente) — nunca sequencial ou previsível.
- Token é de uso único: ao aceitar (MATCH-5), invalidar o token
  imediatamente (ex.: campo `usedAt` preenchido, ou remoção do registro).

## Dados pessoais (LGPD)

- Busca de usuário (MATCH-3) retorna só nome/email — o mínimo para
  identificar o oponente. Nunca senha (hash) ou outro campo interno.
- `.env.example` contém só placeholders inertes.

## Secrets

- Nunca commitar `.env`, `DATABASE_URL` real ou `JWT_SECRET` real.
- Ao encontrar secret versionado: remover do arquivo, rotacionar no
  Railway, registrar como incidente.
