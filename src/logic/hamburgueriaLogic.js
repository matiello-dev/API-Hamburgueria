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
  console.log("chegou logic")
  const produtos = hamburgueriaRepository.listar()

  const novoPedido={
    cliente:body.cliente,
    status:body.status,
    total:body.total,
  }
  const pedidoCadastrado = hamburgueriaRepository.criarPedido(novoPedido);
  
  const produto = hamburgueriaRepository.buscarPorIdProduto(body.produtoId);
  const itensPedido = hamburgueriaRepository.criarItensPedido({
    pedidoId: pedidoCadastrado.id,
    produtoId: produto.id,
    quantidade: body.quantidade,
    precoUnitario: produto.preco
  });
  const itensPedidoCadastrado = hamburgueriaRepository.buscarPorIdItensPedido(itensPedido.id);
  return {pedidoCadastrado, itensPedidoCadastrado};
}