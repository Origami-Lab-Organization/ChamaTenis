# ADR-002 — Camadas Controller → Service → Repository

- Status: Aceito
- Data: 2026-07-22
- Responsável: Gabriel (Tech Lead)

## Contexto

O Lucas está no primeiro projeto real dele. Gabriel já usa Clean
Architecture/DDD completo em outro projeto (`obras-api`), mas esse nível de
abstração (bounded contexts, casos de uso isolados, injeção de dependência
via container) é pesado demais para o primeiro contato dele com back-end
real.

## Decisão

Adotar 3 camadas simples: Controller (recebe request, chama service,
devolve response), Service (regra de negócio) e Repository (acesso ao
banco via Prisma).

## Consequências

- Código mais fácil de navegar no nível do Lucas.
- Menos abstrações que os patterns avançados de outros back-ends da
  Origami (TypeBox, tsyringe, repository paramétrico — ADR-021 do
  harness-core). Não copiar esses patterns para o ChamaTenis sem uma
  decisão nova.
- Se o projeto crescer além do aprendizado inicial, reavaliar em ADR
  próprio — não migrar arquitetura "no meio da história" sem registrar o
  porquê.

## Alternativas Consideradas

- Clean Architecture/DDD completo (padrão do `obras-api`): mais correto a
  longo prazo, mas pesado demais para o primeiro contato do Lucas com
  back-end real.
- Sem camadas (tudo na rota): mais rápido de escrever, mas não ensina
  separação de responsabilidade — descartado.
