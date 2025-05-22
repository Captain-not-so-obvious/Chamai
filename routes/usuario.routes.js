const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Rota para registrar novo usuário
router.post("/registro", usuarioController.criarUsuario);

// Rota para login
router.post("/login", usuarioController.login);

router.get("/", authMiddleware, usuarioController.listarUsuarios);

module.exports = router;