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
