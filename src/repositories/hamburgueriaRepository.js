// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";


// Retorna todas as tarefas ordenadas pelo id.
export function listar() {
  const produtos = db.prepare("SELECT * FROM produtos ORDER BY id").all();
  console.log("produtos", produtos)

  return produtos;
}

// Retorna um produto pelo id ou null quando ele não existe.
export function buscarPorIdProduto(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id);

  return produto;
}
export function buscarPorIdPedido(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id);

  return pedido;
}
export function buscarPorIdItensPedido(id) {
  // O ? mantém o valor separado do SQL e evita montar a consulta com strings.
  const itens = db.prepare("SELECT * FROM itens_pedido WHERE id = ?").get(id);

  return itens;
}

// Retorna TODOS os itens de um pedido, já com o nome do produto.
export function listarItensPorPedido(pedidoId) {
  return db
    .prepare(
      `
      SELECT i.id, i.pedidoId, i.produtoId, p.nome, i.quantidade, i.precoUnitario
      FROM itens_pedido i
      JOIN produtos p ON p.id = i.produtoId
      WHERE i.pedidoId = ?
      ORDER BY i.id
    `,
    )
    .all(pedidoId);
}

// Cria um produto e retorna o registro completo com o id gerado pelo banco.
export function criarPedido(pedido) {
  console.log("chegou repository")
  const resultado = db
    .prepare(
      `
      INSERT INTO pedidos
        (cliente)
      VALUES (?)
    `,
    )
    .run(
      pedido.cliente
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
export function atualizarPedido(id, pedido) {
  const pedidoAtual = buscarPorIdPedido(id);
  console.log("chegou no update")
  if (!pedidoAtual) return null;

  // O SQL é fixo: cada ? recebe um valor na mesma ordem dos campos.
  // A leitura anterior mantém compatibilidade com atualizações parciais.
  const dados = { ...pedidoAtual, ...pedido };

  db.prepare(
    `
    UPDATE pedidos
    SET cliente = ?, status = ?, total = ?
    WHERE id = ?
  `,
  ).run(
    dados.cliente,
    dados.status ?? null,
    dados.total ?? null,
    id,
  );

  return buscarPorIdPedido(id);
}

// Remove uma tarefa e informa se alguma linha foi removida.
export function remover(id) {
  const resultado = db.prepare("DELETE FROM pedidos WHERE id = ?").run(id);

  return resultado.changes > 0;
}
