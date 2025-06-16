const express = require("express");
const router = express.Router();
const chamadoController = require("../controllers/chamado.controller");
const authMiddleware = require("../middleware/authMiddleware");

//Qualquer pessoa pode criar um chamado
router.post("/", chamadoController.criarChamado);

// Mas apenas usuários autenticados podem resolver um chamado
router.put("/:id/resolver", authMiddleware, chamadoController.resolverChamado);

// Rota que lista chamado por status ou técnico
router.get("/", authMiddleware, chamadoController.listarChamados);
router.get("/usuario/:id", authMiddleware, chamadoController.listarChamadosPorUsuario);
router.get("/status/:status", authMiddleware, chamadoController.listarChamadosPorStatus);
router.put("/:id/atribuir", authMiddleware, chamadoController.atribuirTecnico);

// Rota que lista o setor do chamado
router.get("/setores", authMiddleware, chamadoController.listarSetoresDosChamados);

module.exports = router;