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
  const cliente = typeof body.cliente === "string" ? body.cliente.trim() : "";
  if (cliente.length < 2 || cliente.length > 60) {
    const erro = new Error("O nome do cliente deve ter entre 2 e 60 caracteres");
    erro.statusCode = 400;
    throw erro;
  }
  if (!Array.isArray(body.itens) || body.itens.length === 0) {
    const erro = new Error("O pedido deve conter pelo menos um item");
    erro.statusCode = 400;
    throw erro;
  }

  // Valida TODOS os itens antes de gravar qualquer coisa no banco,
  // para não deixar pedido "órfão" quando um item é recusado.
  const itensValidados = body.itens.map((item) => {
    const quantidade = Number(item.quantidade);
    if (!Number.isInteger(quantidade) || quantidade <= 0 || quantidade > 10) {
      const erro = new Error("A quantidade deve ser um inteiro entre 1 e 10");
      erro.statusCode = 400;
      throw erro;
    }
    const produto = hamburgueriaRepository.buscarPorIdProduto(Number(item.produtoId));
    if (!produto) {
      const erro = new Error(`Produto ${item.produtoId} não encontrado`);
      erro.statusCode = 404;
      throw erro;
    }
    if (produto.disponivel === 0) {
      const erro = new Error(`${produto.nome} está indisponível`);
      erro.statusCode = 409;
      throw erro;
    }
    return { produto, quantidade };
  });

  const pedido = hamburgueriaRepository.criarPedido({ cliente });
  for (const { produto, quantidade } of itensValidados) {
    hamburgueriaRepository.criarItensPedido({
      pedidoId: pedido.id,
      produtoId: produto.id,
      quantidade,
      precoUnitario: produto.preco,
    });
  }

  const total = itensValidados.reduce(
    (soma, { produto, quantidade }) => soma + produto.preco * quantidade,
    0,
  );
  hamburgueriaRepository.atualizarPedido(pedido.id, { total });

  // Devolve o pedido "achatado" (como o front espera): id, cliente, status, total, itens.
  return mostrarPedido(pedido.id);
}

export function mostrarPedido(id) {
  const pedido = hamburgueriaRepository.buscarPorIdPedido(id);
  if (!pedido) {
    const erro = new Error("Pedido não encontrado");
    erro.statusCode = 404;
    throw erro;
  }
  const itens = hamburgueriaRepository.listarItensPorPedido(id);
  return { ...pedido, itens };
}

export function atualizarStatusPedido(id, status) {
  console.log("chegou logic atualizarStatusPedido")
  const STATUS_VALIDOS = ["recebido", "preparando", "pronto", "entregue", "cancelado"];
  if (!STATUS_VALIDOS.includes(status)) {
    const erro = new Error("Status inválido");
    erro.statusCode = 400;
    throw erro;
  }
  const pedido = hamburgueriaRepository.buscarPorIdPedido(id);
  if(pedido === undefined){
    const erro = new Error ("pedido não encontrado");
    erro.statusCode = 404;
    throw erro;
  }
  const STATUS_SEGUINTES = {
    recebido: ["preparando", "cancelado"],
    preparando: ["pronto", "cancelado"],
    pronto: ["entregue", "cancelado"],
    entregue: [],
    cancelado: [],
  };
  const statusAtual = pedido.status;
  if (!STATUS_SEGUINTES[statusAtual].includes(status)) {
    console.log("chegou no erro")
    const erro = new Error(`Não é possível alterar o status de ${statusAtual} para ${status}`);
    erro.statusCode = 400;
    throw erro;
  }
  hamburgueriaRepository.atualizarPedido(id, { status });
  return mostrarPedido(id);
}