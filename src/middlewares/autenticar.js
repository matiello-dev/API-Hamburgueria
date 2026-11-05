import jwt from "jsonwebtoken";

// Roda ANTES do controller. Se o token for válido, deixa passar (next);
// se não, a requisição para aqui com 401.
export function autenticar(request, response, next) {
  const header = request.headers.authorization ?? "";
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return response.status(401).json({ mensagem: "Faça login para continuar" });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    request.usuario = dados; // { id, nome, iat, exp }
    return next();
  } catch {
    return response.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}
