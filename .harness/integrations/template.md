# Contrato de Integração — <Sistema>

> Como o NOSSO mundo conversa com o <Sistema> e onde tivemos que torcer a
> realidade pra funcionar. Este NÃO é a doc da API deles — é o nosso
> contrato: mapa de campos, contornos e o porquê de cada um.
>
> ChamaTenis não tem integração externa no MVP (Sprint 1-2) além do
> Postgres/Railway, que não conta como "sistema legado" para este template.
> Use este arquivo quando integrar algo de fato externo (ex.: notificação
> por email/push, calendário, login social).

- **Sistema:** <nome do sistema externo>
- **Tipo:** <API pública / gateway / serviço de terceiro / etc.>
- **Protocolo:** <REST / SOAP / gRPC / webhook>
- **Auth:** <API Key / OAuth2 / etc. — onde o secret vive (NUNCA o valor)>
- **Direção:** <entrada / saída / bidirecional>
- **Criticidade:** <alta / média / baixa> — <por quê>
- **Adapter no código:** <caminho do adapter que isola este sistema>

## Doc do sistema externo

- **Onde vive:** <link da doc oficial>
- **Versão / contrato:** <versão da API, se houver>
- **Última conferência:** <YYYY-MM-DD — quando alguém confirmou que ainda
  bate>
- **Tem sandbox?** <sim/não — onde>

## Fluxos

### <Nome do fluxo>

- **O que faz:** <1 linha>
- **Idempotente?** <sim/não — como garante>
- **Gatilho:** <síncrono na request / job / webhook recebido>

#### Mapa de campos

| Campo nosso | Campo deles | Transformação | Obrigatório |
|-------------|-------------|----------------|-------------|
| `campo` | `CAMPO_DELES` | <transformação> | sim/não |

#### Contornos & o porquê

- <tradução não-óbvia com o motivo e como saber se ainda é necessária>

#### Pontos de falha & fallback

- **Quando falha:** <timeout / 5xx / corpo de erro>
- **Fallback:** <retry / degrada / aborta>
- **Retry seguro?** <sim/não — por quê>

## Dado sensível

> Consulte `.harness/boundaries.md`. Liste o que trafega e como é
> protegido.

- <campo sensível> — <tokenizado / mascarado / não trafega>

## ADRs relacionados

- <ADR-XXX — decisão que afeta esta integração>

## Histórico

- <YYYY-MM-DD> — <o que mudou no contrato e por quê>
