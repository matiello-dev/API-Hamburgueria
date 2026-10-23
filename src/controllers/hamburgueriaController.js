import * as hamburgueriaLogic from "../logic/hamburgueriaLogic.js";


export async function obterProduto(request, response) {
  try {
    const produto = await hamburgueriaLogic.obterCardapio(request.params.id);

    if(produto === null){
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
    console.log("chegou controller")
    const novoPedido = await hamburgueriaLogic.cadastrarPedido(request.body ?? {});

    return response.status(201).json(novoPedido);
  } catch (error) {
    if (error) {
      return response.status(400).json({ mensagem: error.message });
    }

    console.error(`Erro ao cadastrar Pedido: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}
