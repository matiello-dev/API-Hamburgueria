import * as dadoPokemon from "../clients/dadoPokemon.js";
export async function consultar(pokemonDigitado) {
const pokemon = String(pokemonDigitado ?? "").trim().toLowerCase(); // tira traço e outros caracteres não numéricos
if(!/^[a-z0-9-]+$/.test(pokemon)){
const erro = new Error("Nome do Pokémon inválido");
erro.status = 400;
throw erro; 
}
const dados = await dadoPokemon.buscarPokemon(pokemon);
if (!dados) {
const erro = new Error("Pokémon não encontrado");
erro.status = 404;
throw erro;
}

return {
id: dados.id,
nome: dados.name,
altura: dados.height,
peso: dados.weight,
habilidades: dados.abilities.map((habilidade) => habilidade.ability.name),
tipos: dados.types.map((tipo) => tipo.type.name)
};
}