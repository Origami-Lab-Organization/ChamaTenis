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
