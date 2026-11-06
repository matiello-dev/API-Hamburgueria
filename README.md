# API da Hamburgueria

API em Express para gerenciar o cardápio e os pedidos de uma hamburgueria.
Os funcionários fazem login e usam um token (JWT) para acessar as rotas
protegidas. A API também consulta a [PokeAPI](https://pokeapi.co) e devolve os
dados já organizados.

O projeto usa SQLite e segue o fluxo em camadas:

```text
server -> controller -> logic -> repository -> data/banco.db
                          |
                          +-> client -> API pública (PokeAPI)
```

- **controller:** traduz HTTP (requisição e resposta).
- **logic:** valida os dados e coordena o caso de uso.
- **repository:** executa o SQL.
- **client:** único lugar que faz `fetch` para uma API externa.
- **middleware `autenticar`:** confere o token antes de chegar ao controller.

## Pré-requisitos

- Node.js **22.13 ou superior** (usa `node:sqlite` e `fetch` nativos).

O Node pode mostrar um aviso `ExperimentalWarning` sobre SQLite. Ele é esperado
e não impede a execução.

## Instalação

```bash
npm install
```

Crie o arquivo `.env` na raiz do projeto, a partir do exemplo:

```bash
cp .env.example .env
```

E troque o valor de `JWT_SECRET` por um segredo seu:

```text
JWT_SECRET=um-segredo-bem-dificil-de-adivinhar
```

O `.env` está no `.gitignore` e **não deve ser versionado**. Só o
`.env.example` (com valor falso) vai para o repositório.

## Como executar

```bash
npm start
```

Durante o desenvolvimento (reinicia ao salvar):

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

A API fica disponível em `http://localhost:3000`.

## Banco de dados

O arquivo `data/banco.sql` cria as tabelas e os dados iniciais. A conexão
(`src/database/conexao.js`) executa esse script sempre que a API inicia.

| Tabela | Conteúdo |
|---|---|
| `produtos` | Cardápio (lanches, acompanhamentos e bebidas) |
| `pedidos` | Pedidos com cliente, status e total |
| `itens_pedido` | Itens de cada pedido, com preço no momento da compra |
| `funcionarios` | Funcionários com `email` único e `senhaHash` |

O `data/banco.db` é criado automaticamente e não é versionado. Para voltar ao
estado inicial, pare a API, apague o `data/banco.db` e inicie de novo.

## Autenticação

Todas as rotas exigem token, **exceto** o cadastro de funcionário e o login.

1. Cadastre um funcionário com `POST /funcionarios`.
2. Faça login em `POST /login` e copie o `token` da resposta.
3. Envie o token no cabeçalho de cada requisição protegida:

```text
Authorization: Bearer <token>
```

Regras:

- A senha é salva apenas como hash (`bcryptjs`); nenhuma resposta devolve o
  `senhaHash`.
- E-mail errado e senha errada dão a **mesma mensagem** no login (401).
- O token leva `id` e `nome` do funcionário e **expira em 1 hora**.
- Sem token, com token inválido ou expirado, a resposta é **401**.

## Rotas

| Método | Rota | Login? | Descrição |
|---|---|---|---|
| POST | `/funcionarios` | Aberta | Cadastra um funcionário |
| POST | `/login` | Aberta | Devolve o token |
| GET | `/produtos` | Protegida | Lista o cardápio |
| GET | `/produtos/:id` | Protegida | Busca um produto |
| POST | `/pedidos` | Protegida | Cria um pedido |
| GET | `/pedidos/:id` | Protegida | Busca um pedido |
| PATCH | `/pedidos/:id/status` | Protegida | Atualiza o status do pedido |
| GET | `/pokemon/:pokemon` | Aberta | Consulta um pokémon na PokeAPI |

### `POST /funcionarios`

Body:

```json
{ "nome": "Ana", "email": "ana@exemplo.com", "senha": "12345678" }
```

Regras: nome com pelo menos 2 caracteres, e-mail com `@` e senha com pelo menos
8 caracteres.

| Status | Quando |
|---|---|
| 201 | Cadastrado: `{ "id", "nome", "email" }` |
| 400 | Dado inválido |
| 409 | E-mail já cadastrado |

### `POST /login`

Body:

```json
{ "email": "ana@exemplo.com", "senha": "12345678" }
```

| Status | Quando |
|---|---|
| 200 | `{ "token": "..." }` |
| 401 | E-mail ou senha inválidos |

### `GET /produtos` e `GET /produtos/:id`

Devolvem o cardápio (ou um produto) com `id`, `nome`, `categoria`, `preco` e
`disponivel`. `GET /produtos/:id` responde 400 se o id não for número e 404 se o
produto não existir.

### `POST /pedidos`

Body:

```json
{
  "cliente": "João",
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 6, "quantidade": 1 }
  ]
}
```

Regras: cliente com 2 a 60 caracteres, pelo menos um item e quantidade inteira
entre 1 e 10.

| Status | Quando |
|---|---|
| 201 | Pedido criado, com `id`, `cliente`, `status`, `total` e `itens` |
| 400 | Cliente, itens ou quantidade inválidos |
| 404 | Produto não encontrado |
| 409 | Produto indisponível |

### `GET /pedidos/:id`

Devolve o pedido com seus itens. Responde 400 se o id não for número e 404 se o
pedido não existir.

### `PATCH /pedidos/:id/status`

Body:

```json
{ "status": "preparando" }
```

O status segue um fluxo fixo:

| Status atual | Pode ir para |
|---|---|
| `recebido` | `preparando`, `cancelado` |
| `preparando` | `pronto`, `cancelado` |
| `pronto` | `entregue`, `cancelado` |
| `entregue` | (nenhum) |
| `cancelado` | (nenhum) |

| Status | Quando |
|---|---|
| 200 | Pedido com o status novo |
| 400 | Status inválido ou transição não permitida |
| 404 | Pedido não encontrado |

## Integração com API pública: `GET /pokemon/:pokemon`

A rota recebe o nome (ou o número) de um pokémon, consulta a PokeAPI e devolve
só os campos que interessam, com nomes da nossa API.

```bash
curl http://localhost:3000/pokemon/pikachu
```

```json
{
  "id": 25,
  "nome": "pikachu",
  "altura": 4,
  "peso": 60,
  "habilidades": ["static", "lightning-rod"],
  "tipos": ["electric"]
}
```

| Status | Quando |
|---|---|
| 200 | Pokémon encontrado |
| 400 | Nome inválido (aceita só letras, números e hífen) |
| 404 | Pokémon não encontrado |
| 502 | A PokeAPI falhou ou está fora do ar |

O fluxo de uma requisição vira duas: do cliente para a nossa API e da nossa API
para a PokeAPI. O `client` (`src/clients/dadoPokemon.js`) é o único arquivo que
conhece a URL externa; a `logic` valida o que chegou e transforma o "não achei"
em 404.

## Testando com curl

```bash
# 1. Cadastrar
curl -X POST http://localhost:3000/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana","email":"ana@exemplo.com","senha":"12345678"}'

# 2. Login (copie o token da resposta)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@exemplo.com","senha":"12345678"}'

# 3. Usar uma rota protegida
curl http://localhost:3000/produtos \
  -H "Authorization: Bearer SEU_TOKEN"

# 4. Criar um pedido
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cliente":"João","itens":[{"produtoId":1,"quantidade":2}]}'

# 5. Mudar o status
curl -X PATCH http://localhost:3000/pedidos/1/status \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"preparando"}'
```

Também dá para testar pelo Simulador de requisições. Como o CORS permite o
cabeçalho `Authorization`, o token do login pode ser enviado nas requisições
seguintes.

## Organização do código

- `src/server.js`: configura o Express, o CORS e registra as rotas.
- `src/middlewares/autenticar.js`: confere o token JWT nas rotas protegidas.
- `src/controllers/`: traduzem requisições e respostas HTTP
  (`funcionarioController.js`, `hamburgueriaController.js`,
  `pokemonController.js`).
- `src/logic/`: validam e coordenam os casos de uso (`funcionarioLogic.js`,
  `hamburgueriaLogic.js`, `pokemonLogic.js`).
- `src/models/`: regras de entidades (`funcionario.js`, `hamburgueria.js`).
- `src/repositories/`: executam o SQL (`funcionariosRepository.js`,
  `hamburgueriaRepository.js`).
- `src/clients/dadoPokemon.js`: faz o `fetch` para a PokeAPI.
- `src/database/conexao.js`: abre o banco e executa `data/banco.sql`.
- `data/banco.sql`: define as tabelas e os dados iniciais.
- `public/`: tela simples servida em `/app`.

## Tecnologias

- Node.js 22+ e Express 5
- SQLite (`node:sqlite`)
- `bcryptjs` para o hash das senhas
- `jsonwebtoken` para o token de login
