const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/resolvidos/historico", authMiddleware, isAdmin, relatorioController.listarChamadosResolvidosComHistorico);
router.get("/tempo-resolucao", authMiddleware, isAdmin, relatorioController.relatorioTempoResolucao);

module.exports = router;