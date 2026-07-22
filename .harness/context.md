# ChamaTenis — Contexto do Projeto

## Projeto

- Nome: ChamaTenis
- Organização: Origami Lab (projeto interno)
- Estado: projeto novo (greenfield), fase de setup inicial.
- Objetivo: plataforma interna para jogadores de tênis marcarem partidas entre
  si — convidar oponente (por busca ou por link), definir local/data/hora,
  lançar o placar depois de jogar e acompanhar histórico/perfil.

## Propósito adicional — projeto de aprendizado

Além do produto em si, o ChamaTenis é o primeiro projeto real do Lucas
(desenvolvedor). A arquitetura foi deliberadamente simplificada (ver
`.harness/adr/002-camadas-controller-service-repository.md`) para ensinar
separação de responsabilidades sem o peso de Clean Architecture/DDD completo.
Ao revisar ou sugerir código, priorize clareza didática sobre sofisticação
arquitetural — isso é decisão de produto, não falta de rigor.

## Time

- Gabriel: Tech Lead, PM e também desenvolvedor no projeto — acumula os três
  papéis. Como PM organiza backlog/sprints no Jira, prioriza entregas, conduz
  daily/review/retro/planning com o Lucas. Como Tech Lead revisa o que foi
  desenvolvido a nível de código, arquitetura e design. Como dev, cuida do
  setup inicial e do design das telas (via Claude Design).
- Lucas: desenvolvedor — implementa as histórias de backend (Auth, Partidas,
  Placar) e depois as telas de UI, uma vez destravadas pelo design.

## Stack

- Linguagem: TypeScript (backend e frontend).
- Backend: Node.js + Fastify, camadas Controller → Service → Repository (ver
  `.harness/adr/002-camadas-controller-service-repository.md`).
- ORM: Prisma (ver `.harness/adr/001-orm-prisma.md`).
- Banco de dados: PostgreSQL, hospedado no Railway.
- Frontend: React + Vite + React Router.
- Autenticação: from scratch, bcrypt (hash de senha) + JWT (ver
  `.harness/adr/004-auth-from-scratch.md`).
- Hospedagem: Railway (API + Postgres).
- Gestão de backlog: Jira, projeto **CHAM**
  (`origamilab-team.atlassian.net/jira/software/projects/CHAM`).

## Domínio

Ver `.harness/domain-glossary.md` para os termos de negócio (Partida,
Oponente, Convite, Placar, etc.).

## Dados sensíveis / compliance

- Dados pessoais de usuários reais (nome, email, senha) — LGPD se aplica
  mesmo sendo projeto interno.
- Senha nunca é armazenada em texto puro — sempre hash bcrypt.
- Ver `.harness/boundaries.md` e `.harness/patterns/security.md`.

## Governança

- Decisões de arquitetura ficam em `.harness/adr/`.
- Backlog, histórias e critérios de aceite vivem no Jira (projeto CHAM) — o
  `.harness/` não duplica o backlog, só o contexto técnico necessário para
  qualquer agente de IA ajudar no código.
