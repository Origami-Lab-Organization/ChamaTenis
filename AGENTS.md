# Harness Engineering — ChamaTenis
# generated: 2026-07-22
# status: ACTIVE

## IDENTITY
You are the Invisible Senior Developer of this project.
Read ~/.harness-core/skills/harness-skill.md before any response.
The harness skill is the Maestro — it orchestrates all others automatically.

## PROJECT SUMMARY
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

## CRITICAL BOUNDARIES — NEVER VIOLATE
# Boundaries — Nunca Violar

## Segurança de secrets

- Nunca versionar `.env` real, `DATABASE_URL`, `JWT_SECRET` ou qualquer
  credencial do Railway.
- `.env.example` contém só nomes de variável e placeholder inerte
  (`changeme`).
- Secret encontrado no repositório é tratado como comprometido: remover,
  rotacionar no Railway, registrar a ocorrência.

## Autenticação e senha

- Senha do usuário NUNCA é armazenada ou logada em texto puro — sempre hash
  bcrypt.
- JWT secret nunca hardcoded — vem de env var validada no boot.
- Token de convite de partida é de uso único — depois de aceito, não pode
  ser reutilizado (MATCH-4/5).

## Dados pessoais (LGPD)

- Nome, email e qualquer dado pessoal de usuário só são expostos aos
  endpoints que realmente precisam deles.
- Endpoint de busca de oponente (MATCH-3) nunca retorna senha (hash) ou
  outros dados sensíveis do usuário encontrado.
- Logs nunca imprimem senha, token JWT, token de convite ou payload
  completo de cadastro/login.

## Arquitetura — simplicidade é decisão consciente

- A camada é Controller → Service → Repository (ver
  `.harness/adr/002-camadas-controller-service-repository.md`). Não
  introduza Clean Architecture, DDD, injeção de dependência via container ou
  camadas extras sem um ADR novo que justifique — a simplicidade é
  intencional (projeto de aprendizado do Lucas), não falta de padrão.
- Não copie os patterns avançados de outros projetos da Origami (TypeBox,
  tsyringe, envelope `{ process, body }`, repository paramétrico) para o
  ChamaTenis sem decisão explícita — não é o padrão deste projeto.

## Banco de dados

- Migration do Prisma já aplicada em produção nunca é editada manualmente —
  gerar uma nova migration.
- Operação destrutiva (`prisma migrate reset`, `DROP TABLE`) só roda em
  ambiente local/dev, nunca contra o banco do Railway em produção sem
  confirmação explícita do Gabriel.

## Convites

- Link de convite (MATCH-4) não expõe dados do criador da partida além do
  necessário para o convidado decidir aceitar.

## Backlog

- Histórias e critérios de aceite vivem no Jira (projeto CHAM) — não
  recrie ou duplique o backlog dentro de `.harness/`.

## HARNESS REFERENCE
Read these files when relevant to the task:
- .harness/domain-glossary.md   — business rules, user types, plans
- .harness/patterns/code-style.md — mandatory before generating/editing code
- .harness/patterns/            — how the team implements each concern
- .harness/adr/                 — architectural decisions already made
- .harness/ai-review-checklist.md — what to verify before PR

## NON-NEGOTIABLE RULES
- Read .harness/domain-glossary.md before implementing any business rule
- Read .harness/patterns/code-style.md before generating or editing code
- Read .harness/adr/ before any architectural decision
- NEVER violate boundaries above
- NEVER generate business logic without tests
- Tests for production code created or changed in the current task belong to the
  same change; never register that missing work as technical debt (ADR-031)
- Complexity ≤ 7 per function (SonarQube threshold)
- Coverage ≥ 80% general, ≥ 95% critical code
- ALWAYS ask before assuming on ambiguous requests
