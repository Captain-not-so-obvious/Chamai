const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Rota para registrar novo usuário
router.post("/registro", usuarioController.criarUsuario);

//Rota para cadastro de técnicos
router.post("/tecnicos", authMiddleware, usuarioController.criarTecnico)

router.get("/", authMiddleware, usuarioController.listarUsuarios);
router.get("/tecnicos", authMiddleware, usuarioController.listarTecnicos);

module.exports = router;