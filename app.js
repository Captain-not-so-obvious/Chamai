require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require("./models"); // Importa apenas o sequelize
const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================================
// MIDDLEWARES ESSENCIAIS
// =========================================================================
app.use(cors({
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// =========================================================================
// SERVIR OS ARQUIVOS ESTÁTICOS DO FRONTEND
// Esta linha deve vir antes de todas as rotas.
// =========================================================================
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// =========================================================================
// ROTAS DA API
// Padronizando: Todas as rotas da API começarão com /api para fácil identificação
// e para evitar conflitos com as rotas do frontend.
// =========================================================================
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const chamadoRoutes = require("./routes/chamado.routes");
const historicoRoutes = require("./routes/historico.routes");
const relatorioRoutes = require("./routes/relatorio.routes");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chamados", chamadoRoutes);
app.use("/api/historico", historicoRoutes);
app.use("/api/relatorios", relatorioRoutes);

// =========================================================================
// ROTA CORINGA (CATCH-ALL) PARA O FRONTEND
// Esta deve ser a ÚLTIMA rota. Ela captura qualquer requisição que não seja
// para a API e devolve o index.html. Isso permite que o React Router
// (no frontend) controle a navegação.
// =========================================================================
app.get('*', (req, res) => {
  // Se a requisição não for para a API, sirva o app do React.
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    // Se for uma rota /api que não foi encontrada antes, retorna 404.
    res.status(404).send("Endpoint da API não encontrado");
  }
});

// =========================================================================
// INICIALIZAÇÃO DO SERVIDOR E CONEXÃO COM O BANCO
// =========================================================================
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (err) {
    console.error("Erro ao conectar com o banco de dados:", err);
  }
});