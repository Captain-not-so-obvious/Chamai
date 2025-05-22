require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/index");
const { sequelize } = require("./models"); // Alterado para importar diretamente do models
const chamadoRoutes = require("./routes/chamado.routes");
const usuarioRoutes = require("./routes/usuario.routes")
const historicoRoutes = require("./routes/historico.routes");

// Middlewares
app.use(express.json());

// Rotas
app.use("/usuarios", require("./routes/usuario.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/chamados", chamadoRoutes);
app.use("/historico", historicoRoutes);

// Conecta e sincroniza o banco
sequelize.authenticate()
  .then(() => console.log("Conexão com banco estabelecida com sucesso"))
  .catch(err => console.error("Erro na conexão com o banco:", err));

db.sequelize.sync({ alter: true })
  .then(() => console.log("Modelos sincronizados com sucesso"))
  .catch(err => console.error("Erro ao sincronizar modelos", err));

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});