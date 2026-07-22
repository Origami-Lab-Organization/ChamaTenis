# ADR-003 — Local da partida como texto livre

- Status: Aceito
- Data: 2026-07-22
- Responsável: Gabriel (Tech Lead / PM)

## Contexto

Decisão de UI/UX estava em aberto: o local da partida podia ser um campo de
texto livre ou uma lista estruturada de quadras/clubes cadastrados.

## Decisão

O local da partida é um campo de texto livre no MVP.

## Consequências

- Caminho mais rápido para validar o produto.
- Não exige modelo de dados de "Quadra"/"Clube" nem tela de cadastro
  desses recursos.
- Se o produto evoluir para precisar de lista estruturada, é uma mudança
  de modelo de dados (campo texto → relação com tabela de quadras) e uma
  nova decisão de UI/UX — registrar novo ADR quando isso acontecer.

## Alternativas Consideradas

- Lista de quadras/clubes cadastrados: mais estruturado (permitiria
  busca/filtro por local no futuro), mas exige modelagem e tela extra que
  não são essenciais para o MVP.
