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

// atribui técnico ao chamado
router.put("/:id/atribuir", authMiddleware, chamadoController.atribuirTecnico);

// Rota que lista o setor do chamado
router.get("/setores", authMiddleware, chamadoController.listarSetoresDosChamados);

// busca chamados por filtros
router.get("/filtro-busca", authMiddleware, chamadoController.buscarChamadosComFiltros);

// Muda a prioridade do chamado de acordo com as demandas do técnico
router.put("/:id/prioridade", authMiddleware, chamadoController.alterarPrioridade);

module.exports = router;