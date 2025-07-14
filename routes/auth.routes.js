const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Rota de login
router.post("/login", authController.login);

// Rota para recuperar senha
router.post("/recuperar-senha", authController.recuperarSenha);

// Rota para redefinir senha
router.post("/redefinir-senha", authController.redefinirSenha);

module.exports = router;
