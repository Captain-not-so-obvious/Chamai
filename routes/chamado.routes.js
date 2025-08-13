const express = require("express");
const router = express.Router();
const chamadoController = require("../controllers/chamado.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { isTecnicoOrAdmin, isAdmin } = require("../middleware/roleMiddleware");

//Qualquer pessoa pode criar um chamado
router.post("/", chamadoController.criarChamado);

// Mas apenas usuários autenticados podem resolver um chamado
router.put("/:id/resolver", authMiddleware, isTecnicoOrAdmin, chamadoController.resolverChamado);

// Rota que lista chamado por status ou técnico
router.get("/", authMiddleware, isAdmin, chamadoController.listarChamados);
router.get("/usuario/:id", authMiddleware, isAdmin, chamadoController.listarChamadosPorUsuario);
router.get("/status/:status", authMiddleware, isAdmin, chamadoController.listarChamadosPorStatus);

// Rota que lista os chamados atríbuídos ao técnico
router.get("/meus-chamados", authMiddleware, isTecnicoOrAdmin, chamadoController.listarMeusChamados);

// atribui técnico ao chamado
router.put("/:id/admin-atribuir", authMiddleware, isAdmin, chamadoController.adminAutoAtribuir);
router.put("/:id/aceitar", authMiddleware, isTecnicoOrAdmin, chamadoController.tecnicoAceitarChamado);

// Rota que lista o setor do chamado
router.get("/setores", authMiddleware, isAdmin, chamadoController.listarSetoresDosChamados);

// busca chamados por filtros
router.get("/filtro-busca", authMiddleware, isAdmin, chamadoController.buscarChamadosComFiltros);

// Muda a prioridade do chamado de acordo com as demandas do técnico
router.put("/:id/prioridade", authMiddleware, isTecnicoOrAdmin, chamadoController.alterarPrioridade);

// Rota para que o admin direcione o chamado
router.put("/:id/direcionar", authMiddleware, isAdmin, chamadoController.direcionarChamado);

module.exports = router;