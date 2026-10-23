// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// O SQLite guarda booleanos como 0 e 1.
// A API devolve esses valores como false e true.
function mapearProdutos(linha) {
  if (!linha) return null;

  return {
    ...linha,
    concluida: linha.concluida === 1,
  };
}

function mapearItensPedido(linha) {
  if (!linha) return null;

  return {
    ...linha,
    concluida: linha.concluida === 1,
  };
}

function mapearPedidos(linha) {
  if (!linha) return null;

  return {
    ...linha,
    concluida: linha.concluida === 1,
  };
}

// Retorna todas as tarefas ordenadas pelo id.
export function listar() {
  const produtos = db.prepare("SELECT * FROM produtos ORDER BY id").all();

  return produtos.map(mapearProdutos);
}

// Retorna um produto pelo id ou null quando ele não existe.
export function buscarPorIdProduto(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id);

  return mapearProdutos(produto);
}
export function buscarPorIdPedido(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id);

  return mapearPedidos(pedido);
}
export function buscarPorIdItensPedido(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const itens = db.prepare("SELECT * FROM itens_pedido WHERE id = ?").get(id);

  return mapearItensPedido(itens);
}

// Cria um produto e retorna o registro completo com o id gerado pelo banco.
export function criarPedido(pedido) {
  console.log("chegou repository")
  const resultado = db
    .prepare(
      `
      INSERT INTO pedidos
        (cliente, status, total)
      VALUES (?, ?, ?)
    `,
    )
    .run(
      pedido.cliente,
      pedido.status ?? null,
      pedido.total ?? null,
    );
    console.log("resultado", buscarPorIdPedido(Number(resultado.lastInsertRowid)));
  return buscarPorIdPedido(Number(resultado.lastInsertRowid));
}
export function criarItensPedido(itens) {
  console.log("chegou repository itens pedido")
  const resultado = db
    .prepare(
      `
      INSERT INTO itens_pedido
        (pedidoId, produtoId, quantidade, precoUnitario)
      VALUES (?, ?, ?, ?)
    `,
    )
    .run(
      itens.pedidoId,
      itens.produtoId,
      itens.quantidade,
      itens.precoUnitario
    );
    console.log("resultado", buscarPorIdItensPedido(Number(resultado.lastInsertRowid)));
  return buscarPorIdItensPedido(Number(resultado.lastInsertRowid));
}

// Atualiza uma tarefa e retorna o registro atualizado ou null se ela não existir.
export function atualizar(id, tarefa) {
  const tarefaAtual = buscarPorId(id);

  if (!tarefaAtual) return null;

  // O SQL é fixo: cada ? recebe um valor na mesma ordem dos campos.
  // A leitura anterior mantém compatibilidade com atualizações parciais.
  const dados = { ...tarefaAtual, ...tarefa };

  db.prepare(
    `
    UPDATE tarefas
    SET titulo = ?, descricao = ?, prioridade = ?, concluida = ?, usuarioId = ?
    WHERE id = ?
  `,
  ).run(
    dados.titulo,
    dados.descricao ?? null,
    dados.prioridade ?? null,
    dados.concluida ? 1 : 0,
    dados.usuarioId ?? null,
    id,
  );

  return buscarPorId(id);
}

// Remove uma tarefa e informa se alguma linha foi removida.
export function remover(id) {
  const resultado = db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);

  return resultado.changes > 0;
}
