# ChamaTenis — Contexto do Projeto

## O que é

Plataforma interna da Origami Lab para jogadores de tênis marcarem partidas entre si: convidar oponente (por busca ou por link), definir local/data/hora, registrar placar depois de jogar e acompanhar histórico/perfil.

Além do produto, é o **primeiro projeto real do Lucas** (desenvolvedor). A arquitetura foi deliberadamente simplificada para ensinar separação de responsabilidades sem o peso de Clean Architecture/DDD completo.

## Time

- **Gabriel** — Tech Lead + PM + Dev. Organiza backlog/sprints no Jira, revisa código/arquitetura, cuida do setup inicial e do design das telas.
- **Lucas** — desenvolvedor, implementa as histórias de backend e depois as telas.

## Stack

- TypeScript (backend e frontend)
- Backend: Node.js + **Fastify**, camadas **Controller → Service → Repository**
- ORM: **Prisma** · Banco: **PostgreSQL** (Docker local em dev, Railway em produção)
- Frontend: **React + Vite + React Router**
- Auth: from scratch (**bcrypt** + **JWT**), sem serviço terceirizado
- Backlog: **Jira, projeto CHAM** (`origamilab-team.atlassian.net`)

## Arquitetura — decisão consciente (não é lacuna)

O projeto usa 3 camadas simples: **Controller** (recebe request, chama service, devolve response), **Service** (regra de negócio), **Repository** (acesso ao banco via Prisma, exposto como interface).

**Isso é intencional** — não introduzir DDD, Clean Architecture, container de DI ou camadas extras sem uma decisão nova registrada. O motivo: ensinar separação de responsabilidades pro Lucas sem a sobrecarga que o Gabriel usa em projetos mais maduros (ex.: `obras-api`). SOLID (principalmente Dependency Inversion via interface de Repository) é aplicado dentro dessa simplicidade — DDD e SOLID são coisas diferentes, só o primeiro foi descartado.

## Domínio

- **Partida**: local (texto livre), data/hora (`DateTime` único), status, placar.
- **Status**: `aguardando_oponente` → `marcada` → `jogada`.
- **Criador** / **Oponente**: os dois jogadores da partida. Oponente definido por busca (usuário existente) ou convite (link com token de uso único).
- **Convite**: token único; funciona mesmo pra quem não tem conta (direciona pro cadastro linkado à partida).
- **Placar**: texto livre (ex. "6-4, 6-3"); qualquer um dos dois jogadores pode registrar, **sem confirmação do outro lado** (dívida técnica aceita conscientemente, ver TD-0001).

## Regras que nunca podem ser violadas

- Senha nunca em texto puro (hash bcrypt) nem em log/response.
- JWT secret via env var, nunca hardcoded.
- Token de convite é de uso único.
- Busca de usuário nunca retorna senha/hash de outro usuário.
- `.env` real nunca versionado.

## Status atual (produto real, não só desenho)

| História | O que é | Status |
|---|---|---|
| SETUP-1 | Estrutura do repo (api/ + web/, lint, typecheck, env.ts) | ✅ Feito |
| SETUP-2 | Postgres local (Docker) + schema Prisma (`User`, `Partida`) | ✅ Feito |
| SETUP-3 | Roteamento do frontend (8 rotas) | Pendente |
| AUTH-1 | `UserRepository` (Repository de Usuário) | **Próxima do Lucas** — desbloqueada |
| AUTH-2 / AUTH-3 | Endpoints de cadastro e login | Pendentes (dependem do AUTH-1) |
| MATCH-1 a 5, SCORE-1/2 | Partidas, convite, placar, histórico | Desenhadas no Jira, não implementadas |
| UI/UX (8 telas) | Design no Claude Design + `/design-sync` | Pendente |

Todo o backlog técnico detalhado (contratos HTTP, cenários de teste, critérios de aceite) já está escrito nas issues do Jira, projeto **CHAM** — cada história tem uma seção "Para o agente — Contexto técnico" pensada pra IA implementar direto.

## Onde estão as fontes de verdade

- `.harness/context.md`, `boundaries.md`, `domain-glossary.md` — contexto, limites, termos de negócio.
- `.harness/adr/` — decisões (ORM Prisma, camadas simplificadas, local texto livre, auth from scratch).
- `.harness/patterns/` — como o time implementa cada coisa (segurança, testes, logging, erro).
- `.harness/tech-debt/log.md` — dívida técnica aceita conscientemente (ex.: placar sem confirmação).
- Jira (projeto CHAM) — backlog e critérios de aceite de cada história.
