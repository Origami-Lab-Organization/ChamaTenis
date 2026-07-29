# ADR-005 — Padrão de contratos HTTP, rotas e validação de input (Zod)

- Status: Aceito
- Data: 2026-07-28
- Responsável: Gabriel (Tech Lead)

## Contexto

A review do CHAM-4 (endpoint de cadastro) encontrou o mesmo tipo de furo em
vários pontos: rota registrada sem o prefixo `/api/auth` do contrato, resposta
de sucesso e de erro em formato diferente do especificado na história, e a
regra de senha forte esquecida por completo na validação manual (`if`
soltos). Nenhum desses pontos tinha um padrão escrito em `.harness/` — cada
história definia seu próprio contrato "para o agente", sem uma convenção
geral que amarrasse isso entre histórias.

Decisão tomada junto com pesquisa em notas próprias (Obsidian) sobre design de
API e stacks Fastify — para decidir o que faz sentido adotar agora versus o
que é sofisticação demais para o estágio atual do projeto.

## Decisão

1. **Rotas:** todo grupo de rotas é registrado com prefixo explícito por
   domínio via `app.register(rotas, { prefix: '/api/<dominio>' })` — nunca
   hardcoded dentro do arquivo de rotas.
2. **Contrato de resposta:** sucesso devolve o recurso direto com chave
   descritiva (ex.: `{ usuario, token }`), sem envelope genérico (`{ data }`).
   Erro sempre `{ error: "<CODIGO_ESTAVEL>" }`, código em `UPPER_SNAKE_CASE`
   estável — não a mensagem livre usada até aqui. Mais simples que RFC
   9457/Problem Details (avaliado e descartado — ver Alternativas).
3. **JWT:** payload mínimo (`{ id }`), `exp` explícito, `JWT_SECRET`
   validada no boot. Sem refresh token por enquanto — um único access token
   com expiração de 7 dias.
4. **Validação de input:** adota Zod como padrão único de validação em
   todo endpoint novo, substituindo os `if` manuais de valida
   ção. Schema Zod valida em runtime e infere o tipo — evita duplicar
   "regra de validação" e "tipo TypeScript" como duas fontes que podem
   divergir (foi exatamente a divergência que deixou a regra de senha forte
   passar batido no CHAM-4).

## Consequências

- Primeira dependência de validação do projeto (`zod`) — pequena, sem
  runtime pesado, mas é uma lib nova que o Lucas precisa aprender.
- Contrato de resposta mais previsível entre histórias — quem consome a API
  (frontend) não precisa adivinhar o formato história por história.
- Regra de negócio de validação passa a viver no schema Zod dentro do
  Service (não no Controller) — mantém ADR-002 (Controller só delega).
- Endpoints já implementados antes deste ADR (nenhum em produção ainda; o
  CHAM-4 está em review) devem ser ajustados para seguir o padrão antes do
  merge — não é dívida técnica, é o próprio diff em andamento.

## Alternativas Consideradas

- **RFC 9457 / Problem Details** (`{ type, title, status, detail,
  instance }`): padrão de mercado mais rico, mas sofisticação desnecessária
  para uma API interna com um único consumidor (o frontend do próprio
  ChamaTenis). Reavaliar se a API um dia for exposta a terceiros.
- **Envelope genérico `{ data }` / `{ data, meta }`:** mais genérico, mas o
  projeto já usa chaves descritivas por recurso em cada história do Jira
  (`usuario`, futuramente `partida`) — formalizar isso é menos mudança do
  que introduzir um envelope novo.
- **Manter validação manual (`if`):** zero dependência nova, mais alinhado
  ao espírito de simplicidade do ADR-002, mas é justamente o que causou a
  lacuna da senha forte no CHAM-4 — descartado por esse motivo concreto.
- **Access + refresh token:** padrão mais seguro para revogação, mas
  adiciona storage de refresh token e endpoint de refresh que a história de
  login (AUTH-3) ainda não cobre. Revisitar se o projeto sair do estágio
  interno/aprendizado.
