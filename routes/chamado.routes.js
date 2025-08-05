const express = require("express");
const router = express.Router();
const chamadoController = require("../controllers/chamado.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { isTecnicoOrAdmin } = require("../middleware/roleMiddleware");

//Qualquer pessoa pode criar um chamado
router.post("/", chamadoController.criarChamado);

// Mas apenas usuários autenticados podem resolver um chamado
router.put("/:id/resolver", authMiddleware, isTecnicoOrAdmin, chamadoController.resolverChamado);

// Rota que lista chamado por status ou técnico
router.get("/", authMiddleware, isTecnicoOrAdmin, chamadoController.listarChamados);
router.get("/usuario/:id", authMiddleware, isTecnicoOrAdmin, chamadoController.listarChamadosPorUsuario);
router.get("/status/:status", authMiddleware, isTecnicoOrAdmin, chamadoController.listarChamadosPorStatus);

// atribui técnico ao chamado
router.put("/:id/atribuir", authMiddleware, isTecnicoOrAdmin, chamadoController.atribuirTecnico);

// Rota que lista o setor do chamado
router.get("/setores", authMiddleware, isTecnicoOrAdmin, chamadoController.listarSetoresDosChamados);

// busca chamados por filtros
router.get("/filtro-busca", authMiddleware, isTecnicoOrAdmin, chamadoController.buscarChamadosComFiltros);

// Muda a prioridade do chamado de acordo com as demandas do técnico
router.put("/:id/prioridade", authMiddleware, isTecnicoOrAdmin, chamadoController.alterarPrioridade);

module.exports = router;