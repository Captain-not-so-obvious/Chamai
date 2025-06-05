const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/resolvidos/historico", authMiddleware, relatorioController.listarChamadosResolvidosComHistorico);
router.get("/tempo-resolucao", authMiddleware, relatorioController.relatorioTempoResolucao);

module.exports = router;
