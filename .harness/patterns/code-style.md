# Pattern — Estilo de Código

Convenções transversais de estilo — valem para qualquer stack (backend,
frontend). Especificidades de stack ficam nos patterns próprios.

## Comentários

- Todo código novo começa com zero comentários. Antes de comentar, renomeie,
  extraia ou simplifique até o código comunicar a intenção sozinho.
- `TODO`, `FIXME`, suppression ou teste ignorado criado no diff é trabalho
  incompleto: resolva agora. Só proponha dívida para condição preexistente
  fora do escopo ou exceção temporária explicitamente aprovada (ADR-031 do
  harness-core).
- Comentário é exceção para uma regra ou restrição muito específica que
  nomes, tipos, estrutura e testes não conseguem expressar: invariante não
  trivial, workaround de terceiro com condição de remoção ou trade-off
  intencional. Nesses casos, use uma frase curta explicando o porquê.
- Referência a história do Jira, critério de aceite ou ADR, sozinha, não
  justifica comentário. Não copie história, critério de aceite ou
  rastreabilidade (`MATCH-2`, `AUTH-3`) para o código. Conhecimento durável
  vive no `domain-glossary.md` ou em ADR.
- Não comente o obvio ("cria o usuário", "retorna a partida"), não narre o
  fluxo linha a linha e não deixe código comentado (dead code) no diff —
  remova.

## TypeScript — contratos separados de comportamento

- Quando o arquivo crescer o suficiente para justificar, separe o contrato
  exportado (`export type`/`export interface`) da implementação (ex.:
  `<contexto>.types.ts`). Em arquivo pequeno e didático, um tipo local
  curto pode continuar junto da implementação — não force separação em
  arquivo de poucas linhas.
- Use `import type` ao consumir um contrato separado.

## Como aplicar

- Ao escrever para o time, siga nomes (em português, alinhados ao
  `domain-glossary.md`) e formatação do código ao redor.
- Em review, remova comentário redundante antes de considerar a história
  concluída.
