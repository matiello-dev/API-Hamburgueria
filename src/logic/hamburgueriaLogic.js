import * as hamburgueriaRepository from "../repositories/hamburgueriaRepository.js";

// Mantém a rota inicial GET / retornando a primeira tarefa do banco.
export function obterCardapio(id) {
  return hamburgueriaRepository.buscarPorIdProduto(id);
}

// A logic coordena a consulta; somente o repository conhece o SQL.
export function listarCardapio() {
  return hamburgueriaRepository.listar();
}
export function cadastrarPedido(body) {
  
  const novoPedido={
    cliente:body.cliente
  }
  const pedidoCadastrado = hamburgueriaRepository.criarPedido(novoPedido)
  console.log("chegou logic")
  
  const itens = body.itens
  const itensPedido =  itens.map((item) => {
    console.log("chegou no item")
    const produto = hamburgueriaRepository.buscarPorIdProduto(item.produtoId);
    return hamburgueriaRepository.criarItensPedido({
    pedidoId: pedidoCadastrado.id,
    produtoId: item.produtoId,
    quantidade: item.quantidade,
    precoUnitario: produto.preco
  })
})
  const total = itensPedido.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);
  console.log("total", total)
  const pedidoAtualizado = hamburgueriaRepository.atualizarPedido(pedidoCadastrado.id, { total });
  return {pedidoAtualizado};
}