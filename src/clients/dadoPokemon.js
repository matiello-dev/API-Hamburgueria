function falhaExterna() {
const erro = new Error("Não foi possível consultar o pokemon agora. Tente de novo.");
erro.status = 502;
return erro;
}

export async function buscarPokemon(pkm) {
let resposta;
try {
resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pkm)}`);
if (resposta.status === 404) return null; // Pokémon não encontrado
} catch {
throw falhaExterna(); // sem internet ou pokeapi fora do ar
}
if (!resposta.ok) throw falhaExterna();
return resposta.json();
}