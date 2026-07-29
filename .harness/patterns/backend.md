# Pattern — Backend (Fastify + Prisma)

Convenções de endpoint que valem para toda rota nova, complementando
`error-handling.md` (tradução de erro para status HTTP) e `security.md`
(regras de senha/JWT). Decisão registrada em
`.harness/adr/005-padrao-contratos-http-e-validacao-zod.md`.

## Rotas

- Toda rota é registrada com prefixo explícito por domínio:
  `app.register(rotasDoDominio, { prefix: '/api/<dominio>' })` — nunca
  hardcoded dentro do arquivo de rotas (`app.post('/api/auth/cadastro', ...)`
  dentro de `user.routes.ts` é o sinal de problema).
- `server.ts` só monta os plugins de rota; não conhece o path completo de
  cada endpoint.

## Contrato de resposta

- Sucesso devolve o recurso direto com chave descritiva
  (`{ usuario, token }`, futuramente `{ partida }`, `{ partidas, meta }` em
  lista) — sem envelope genérico `{ data }`.
- Erro sempre `{ error: "<CODIGO_ESTAVEL>" }` — string em
  `UPPER_SNAKE_CASE`, estável entre deploys (é contrato de API, não
  mensagem para humano). Nunca `{ message: "frase livre" }`.
- Status HTTP segue o padrão REST: 200 leitura, 201 criação, 400 validação,
  401 não autenticado, 404 não encontrado, 409 conflito, 500 erro interno
  sem detalhe.

## Validação de input (Zod)

- Todo endpoint novo valida o input com um schema Zod no Service — nunca
  `if` manual solto. O schema é a única fonte de verdade: valida em runtime
  e infere o tipo TypeScript do input (`z.infer<typeof schema>`).
- Erro de validação do Zod (`ZodError`) é traduzido no Service para a
  exception de negócio do domínio (ex.: `DadosCadastroInvalidosError`) — o
  Controller não sabe que o Service usa Zod.
- Regra de negócio que Zod não expressa bem (ex.: "email já cadastrado")
  continua sendo checagem explícita no Service, depois da validação de
  schema passar.

```typescript
const cadastroSchema = z.object({
  nome: z.string().trim().min(1),
  email: z.string().email(),
  senha: z.string().min(8).regex(/[A-Za-z]/).regex(/\d/),
});

async cadastrar(input: unknown) {
  const dados = cadastroSchema.safeParse(input);
  if (!dados.success) {
    throw new DadosCadastroInvalidosError(dados.error.issues[0].message);
  }
  ...
}
```

## Concorrência em criação com chave única

- Toda criação que depende de unicidade (email, futuramente token de
  convite) trata a violação de constraint única do Postgres (`P2002` no
  Prisma) como o caminho de erro esperado, não como 500 genérico — o
  check-antes-de-criar (`findByEmail` seguido de `create`) sozinho não
  fecha a corrida entre duas requisições simultâneas.
