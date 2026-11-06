
import * as pokemonLogic from "../logic/pokemonLogic.js"
export async function consultar(request, response) {
try {
const pokemon = await pokemonLogic.consultar(request.params.pokemon);
return response.status(200).json(pokemon);
} catch (error) {
return response.status(error.status ?? 400).json({ mensagem:
error.message });
}
}