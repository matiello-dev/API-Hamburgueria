import express from "express";
import { fileURLToPath } from "node:url";
import * as hamburgueriaController from "./controllers/hamburgueriaController.js";

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


app.get("/produtos/:id", hamburgueriaController.obterProduto);
app.get("/produtos", hamburgueriaController.listarCardapio);
app.post("/pedidos", hamburgueriaController.cadastrarPedido);
app.get("/pedidos/:id", hamburgueriaController.mostrarPedido)
app.patch("/pedidos/:id/status", hamburgueriaController.atualizarStatusPedido)


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;
