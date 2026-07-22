# ADR-004 — Autenticação from scratch (bcrypt + JWT)

- Status: Aceito
- Data: 2026-07-22
- Responsável: Gabriel (Tech Lead)

## Contexto

Decisão de desenvolvimento estava em aberto entre implementar autenticação
from scratch ou plugar um serviço pronto (ex.: Auth0, Clerk, Supabase
Auth).

## Decisão

Implementar autenticação from scratch com bcrypt (hash de senha) + JWT
(token de sessão), sem serviço terceirizado.

## Consequências

- Mais código para o Lucas escrever e entender (hash, comparação,
  geração/validação de token) — é aprendizado real de como autenticação
  funciona por baixo dos panos.
- O time assume a responsabilidade de acertar os detalhes de segurança
  (expiração de token, custo de hash adequado, nunca logar senha) — ver
  `.harness/patterns/security.md`.

## Alternativas Consideradas

- Serviço de auth pronto (Auth0/Clerk/Supabase Auth): mais rápido e mais
  seguro por padrão, mas ensina menos sobre o funcionamento interno de
  autenticação — principal motivo para não escolher aqui.
