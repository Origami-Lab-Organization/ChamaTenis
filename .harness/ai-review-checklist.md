# AI Review Checklist — ChamaTenis

## Obrigatório

- A mudança respeita `.harness/boundaries.md`.
- Nenhum secret foi adicionado, movido ou impresso (`.env`,
  `DATABASE_URL`, `JWT_SECRET`).
- Senha nunca aparece em log, response de API ou commit — sempre hash
  bcrypt.
- Camadas respeitadas: Controller não tem regra de negócio nem acessa o
  Prisma direto; Service não conhece Fastify (request/reply); Repository é
  o único lugar que chama o Prisma Client
  (`.harness/adr/002-camadas-controller-service-repository.md`).
- Erro de negócio usa classe de erro própria + error handler central — não
  `reply.status(4xx).send()` espalhado pela rota
  (`.harness/patterns/error-handling.md`).
- Todo endpoint/regra de negócio novo ou alterado tem teste no mesmo diff
  (`.harness/patterns/testing.md`). Falta de teste não virou dívida
  técnica.
- Token de convite: uso único respeitado (não pode aceitar duas vezes).
- Busca de usuário (MATCH-3) não retorna senha/hash nem dado sensível além
  do necessário.
- Código começa sem comentários; comentário restante só justifica
  regra/restrição que nome/tipo/teste não expressam
  (`.harness/patterns/code-style.md`).

## Para o backend (Fastify + Prisma)

- Validação de input roda no Service (regra de negócio) — Controller só
  recebe e delega. Validação usa schema Zod, não `if` manual solto
  (`.harness/patterns/backend.md`, ADR-005).
- Rota registrada com prefixo de domínio (`/api/<dominio>`) via
  `app.register(..., { prefix })` — bate com o contrato HTTP da história,
  não hardcoded dentro do arquivo de rotas.
- Resposta de sucesso usa chave descritiva do recurso (`{ usuario, token }`
  etc.), nunca envelope genérico `{ data }`. Resposta de erro é
  `{ error: "<CODIGO_ESTAVEL>" }`, nunca `{ message: "frase livre" }`.
- Criação com campo único (email, token de convite) trata a violação de
  constraint única do Postgres (`P2002`) como caminho de erro esperado —
  não confia só no check-antes-de-criar para evitar duplicata em requisições
  concorrentes.
- Variáveis de ambiente obrigatórias (`DATABASE_URL`, `JWT_SECRET`) são
  validadas no boot — processo falha cedo se faltar alguma.
- Sem N+1 óbvio: não há `findUnique`/`findFirst` dentro de loop quando uma
  consulta em lote resolveria.
- Migration do Prisma versionada — nunca editar migration já aplicada em
  produção.

## Para o frontend (React)

- Tela que consome API trata loading/empty/error.
- Nenhum secret no bundle (só `VITE_*` públicas).
- Botão de ação com verbo no infinitivo (`Criar partida`, `Registrar
  placar`) — não `OK`/`Confirmar` genérico.

## Para revisão do código do Lucas (contexto de mentoria)

- Priorize feedback didático: aponte o porquê, não só o "está errado" —
  este é o primeiro projeto real dele.
- Não sugira Clean Architecture, DDD ou container de DI como "correção" —
  a simplicidade é decisão do projeto
  (`.harness/adr/002-camadas-controller-service-repository.md`), não
  lacuna.
