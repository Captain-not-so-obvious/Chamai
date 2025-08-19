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
const path = require('path');
const { ok } = require("assert");

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

// Middleware para arquivos estáticos
(function wrapAppMethods() {
  const origUse = app.use.bind(app);
  app.use = function (...args) {
    try {
      console.log('DEBUG app.use args:', args.map(a => {
        if (typeof a === 'string') return `STRING:${a}`;
        if (a && a.stack) return `ERROR_OBJECT`;
        return a && a.name ? `FUNC:${a.name}` : typeof a;
      }));
      return origUse(...args);
    } catch (err) {
      console.error('DEBUG app.use failed with args:', args);
      console.error(err);
      throw err;
    }
  };

  const origGet = app.get.bind(app);
  app.get = function (...args) {
    try {
      console.log('DEBUG app.get args:', args.map(a => {
        if (typeof a === 'string') return `STRING:${a}`;
        return a && a.name ? `FUNC:${a.name}` : typeof a;
      }));
      return origGet(...args);
    } catch (err) {
      console.error('DEBUG app.get failed with args:', args);
      console.error(err);
      throw err;
    }
  };
})();

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// Inicia o servidor
app.listen(3000, '0.0.0.0', () => {
  console.log("Servidor rodando na porta 3000");
});