# Tech Debt Log — ChamaTenis

## Critério de entrada (ADR-031 do harness-core)

- Registre somente condição preexistente fora do escopo atual, ou
  mitigação temporária explicitamente aprovada.
- Não registre falta de teste, `TODO`/`FIXME` ou trabalho incompleto criado
  pelo próprio diff — isso é entrega incompleta, corrija antes de finalizar
  a história.

## TD-0001 — Placar sem confirmação do outro jogador

- Status: aberto (aceito conscientemente)
- Prioridade: baixa
- Criado em: 2026-07-22
- Contexto: SCORE-1 permite que qualquer um dos dois jogadores vinculados à
  partida registre o placar, sem exigir confirmação do outro lado. Decisão
  tomada no brief inicial do MVP (Sprint 1) para não travar o fluxo com uma
  segunda etapa de aprovação.
- Impacto: um jogador pode registrar um placar incorreto ou de má-fé sem o
  outro poder contestar via produto (só fora dele).
- Próximo passo: se virar problema real de uso, adicionar confirmação ou
  contestação de placar (ambos os IDs precisam validar) — não faz parte do
  MVP.
- Origem: brief de Sprint 1, decisão consciente do Gabriel (Tech
  Lead/PM).

## TD-0002 — Teste de email duplicado (AUTH-1) não verifica o código de erro

- Status: aberto
- Prioridade: baixa
- Criado em: 2026-07-27
- Contexto: `user.repository.test.ts` (CHAM-2/AUTH-1) testa o Cenário 4
  ("email duplicado propaga o erro de constraint única do Postgres") com
  `.rejects.toThrow()` genérico — passa com qualquer erro, não só com a
  violação de unique constraint (`P2002` do Prisma). Encontrado em
  auditoria de código posterior à aprovação/merge do PR, não no diff
  original.
- Impacto: o teste não protege contra regressão real — se o `create`
  passar a lançar um erro diferente por engano (ex.: bug de conexão,
  digitação errada na query), o teste continua verde.
- Próximo passo: trocar por
  `.rejects.toMatchObject({ code: 'P2002' })` (ou equivalente checando
  `Prisma.PrismaClientKnownRequestError`).
- Origem: auditoria de código de nível mais profundo pedida pelo Gabriel
  após a aprovação do PR #1 — registrado como TD (exceção aprovada
  explicitamente) em vez de reabrir a história já mergeada.

## TD-0003 — Setup de teste falha com erro cru se `.env` não existir

- Status: aberto
- Prioridade: baixa
- Criado em: 2026-07-27
- Contexto: `api/vitest.setup.ts` chama `process.loadEnvFile()` sem
  tratamento. Confirmado rodando: sem `api/.env`, `npm test` falha com
  `Error: ENOENT: no such file or directory, open '.env'` — sem explicar
  o que fazer. O projeto já tem o padrão certo pra isso em `env.ts`
  (mensagem clara de variável ausente), mas o setup de teste não o segue.
- Impacto: primeira pessoa (dev novo ou pipeline de CI futuro) que rodar
  `npm test` antes de copiar `.env.example` pra `.env` recebe um erro que
  não diz o que fazer.
- Próximo passo: validar a existência do `.env` no `vitest.setup.ts` e
  lançar mensagem no mesmo estilo do `env.ts` (`"Copie
  api/.env.example para api/.env antes de rodar os testes."`).
- Origem: mesma auditoria pós-merge do TD-0002 — exceção aprovada
  explicitamente pelo Gabriel.
