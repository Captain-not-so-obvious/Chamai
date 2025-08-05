const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { isTecnicoOrAdmin } = require("../middleware/roleMiddleware");

// Rota para registrar novo usuário
router.post("/registro", usuarioController.criarUsuario);

//Rota para cadastro de técnicos
router.post("/tecnicos", authMiddleware, isAdmin, authMiddleware, usuarioController.criarTecnico)

router.get("/", authMiddleware, isTecnicoOrAdmin, usuarioController.listarUsuarios);
router.get("/tecnicos", authMiddleware, isTecnicoOrAdmin, usuarioController.listarTecnicos);

module.exports = router;