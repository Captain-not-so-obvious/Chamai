const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const historicoController = require("../controllers/historico.controller");
const { isTecnicoOrAdmin } = require("../middleware/roleMiddleware");

router.get("/:chamadoId", authMiddleware, isTecnicoOrAdmin, historicoController.listarHistoricoPorChamado);
router.post("/:chamadoId", authMiddleware, isTecnicoOrAdmin, historicoController.adicionarComentario);

module.exports = router;