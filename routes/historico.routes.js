const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const historicoController = require("../controllers/historico.controller");

router.get("/:chamadoId", authMiddleware, historicoController.listarHistoricoPorChamado);
router.post("/:chamadoId", authMiddleware, historicoController.adicionarComentario);

module.exports = router;