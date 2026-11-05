import express from "express";
import { fileURLToPath } from "node:url";
import * as funcionariosController from "./controllers/funcionarioController.js";
import * as hamburgueriaController from "./controllers/hamburgueriaController.js";
import { autenticar } from "./middlewares/autenticar.js";

const app = express();
const PORTA = Number(process.env.PORT || 3000);

app.use("/app",express.static("public"))

// Permite que o SimuladorRequest.html seja aberto fora deste projeto.
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,OPTIONS",
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.post("/funcionarios", funcionariosController.cadastrar);
app.post("/login", funcionariosController.login);

app.get("/produtos/:id",autenticar , hamburgueriaController.obterProduto);
app.get("/produtos", autenticar, hamburgueriaController.listarCardapio);
app.post("/pedidos", autenticar, hamburgueriaController.cadastrarPedido);
app.get("/pedidos/:id",autenticar , hamburgueriaController.mostrarPedido)
app.patch("/pedidos/:id/status", autenticar, hamburgueriaController.atualizarStatusPedido)


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;
