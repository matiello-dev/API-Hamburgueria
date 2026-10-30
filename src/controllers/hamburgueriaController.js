import * as hamburgueriaLogic from "../logic/hamburgueriaLogic.js";


export async function obterProduto(request, response) {
  try {
  
    const id = Number(request.params.id);
  if(isNaN(id) ){
    return response.status(400).json({ mensagem: "ID precisa ser um número válido" });
  }
      
    const produto = await hamburgueriaLogic.obterCardapio(id);

    if(!produto){
      return response.status(404).json({
        mensagem: "Produto não encontrado",
      });
    }
    return response.status(200).json(produto);
  } catch (error) {
    console.error(`Erro ao obter Produto: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}

export async function listarCardapio(request, response) {
  try {
    const cardapio = await hamburgueriaLogic.listarCardapio();

    return response.status(200).json(cardapio);
  } catch (error) {
    console.error(`Erro ao listar cardapio: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}

export async function cadastrarPedido(request, response) {
  try {
    const novoPedido = await hamburgueriaLogic.cadastrarPedido(request.body ?? {});

    return response.status(201).json(novoPedido);
  } catch (error) {
    if (error.statusCode) {
      return response.status(error.statusCode).json({ mensagem: error.message });
    }

    console.error(`Erro ao cadastrar Pedido: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}
export async function mostrarPedido(request, response) {
  try {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json({ mensagem: "ID precisa ser um número válido" });
    }

    const pedido = await hamburgueriaLogic.mostrarPedido(id);

    if (!pedido) {
      return response.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    return response.status(200).json(pedido);
  } catch (error) {
    console.error(`Erro ao mostrar Pedido: ${error.message}`);
    return response.status(error.statusCode || 500).json({ mensagem: error.statusCode ? error.message : "Erro interno do servidor" });
  }
}
export async function atualizarStatusPedido(request, response) {
  console.log("chegou controller atualizarStatusPedido")
  try {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json({ mensagem: "ID precisa ser um número válido" });
    }

    const statusPedidoAtualizado = await hamburgueriaLogic.atualizarStatusPedido(id, request.body?.status);

    if (!statusPedidoAtualizado) {
      return response.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    return response.status(200).json(statusPedidoAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar Status do Pedido: ${error.message}`);
    return response.status(error.statusCode || 500).json({ mensagem: error.message || "Erro interno do servidor" });
  }
}
