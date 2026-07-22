# Glossário do Domínio — ChamaTenis

- Partida: uma partida de tênis entre dois jogadores. Tem local (texto
  livre), data/hora (um único campo `DateTime`, não dois campos separados —
  decisão fechada no refactor das histórias de SETUP-2), status e placar.
- Status da Partida: `aguardando_oponente` (criada, sem oponente confirmado)
  → `marcada` (oponente confirmado, data no futuro) → `jogada` (data
  passou, placar pode ser lançado).
- Criador: jogador que cria a Partida.
- Oponente: o segundo jogador da Partida. Pode ser definido por busca
  (usuário já cadastrado) ou por convite (link, aceito depois).
- Convite: link único gerado para definir o Oponente de uma Partida sem
  busca direta. Token de uso único; funciona mesmo para quem ainda não tem
  conta (direciona pro cadastro linkado à partida).
- Placar: resultado registrado depois que a Partida foi jogada. Qualquer um
  dos dois jogadores vinculados pode lançar, sem confirmação do outro lado
  (ver `.harness/tech-debt/log.md`, TD-0001).
- Perfil: dados básicos do usuário + histórico de partidas jogadas.
- Histórico: lista de partidas com status `jogada` de um usuário, ordenada
  por data decrescente.
- Usuário/Jogador: pessoa cadastrada (nome, email, senha hash).

Convenções de nome no código (services, tabelas, variáveis) devem seguir
esses termos em português — não traduzir "Partida" para "Match" e "Placar"
para "Score" sem necessidade. Manter consistência ajuda o Lucas a mapear
código ↔ domínio.
