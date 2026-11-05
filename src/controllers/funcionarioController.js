import * as funcionarioLogic from "../logic/funcionarioLogic.js";

export async function cadastrar(request, response) {
  try {
    const funcionario = await funcionarioLogic.cadastrar(request.body ?? {});
    return response.status(201).json(funcionario);
  } catch (error) {
    return response.status(error.status ?? 400).json({ mensagem: error.message });
  }
}

export async function login(request, response) {
  try {
    const resultado = await funcionarioLogic.login(request.body ?? {});
    return response.status(200).json(resultado);
  } catch (error) {
    return response.status(error.status ?? 400).json({ mensagem: error.message });
  }
}
