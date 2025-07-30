require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const db = require("./models/index");
const { sequelize } = require("./models");
const chamadoRoutes = require("./routes/chamado.routes");
const usuarioRoutes = require("./routes/usuario.routes")
const historicoRoutes = require("./routes/historico.routes");
const relatorioRoutes = require("./routes/relatorio.routes");

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições do frontend
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/usuarios", require("./routes/usuario.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/chamados", chamadoRoutes);
app.use("/historico", historicoRoutes);
app.use("/relatorios", relatorioRoutes);

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