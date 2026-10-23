// Representa a entidade do domínio: o que é uma tarefa e quais regras
// ela precisa cumprir para existir. A validação fica no construtor, então
// um objeto Tarefa inválido nunca chega a ser criado.
export class Tarefa {
  constructor({
    id,
    titulo,
    descricao = "",
    prioridade = "media",
    concluida = false,
  }) {
    if (typeof titulo !== "string" || titulo.trim() === "") {
      throw new Error("O campo titulo é obrigatório");
    }

    const prioridades = ["baixa", "media", "alta"];
    if (!prioridades.includes(prioridade)) {
      throw new Error(
        `O campo prioridade deve ser: ${prioridades.join(", ")}`,
      );
    }

    this.id = id;
    this.titulo = titulo.trim();
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.concluida = concluida;
  }
}
