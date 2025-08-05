const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { isTecnicoOrAdmin } = require("../middleware/roleMiddleware");

// Rota de login
router.post("/login", authController.login);

// Rota para recuperar senha
router.post("/recuperar-senha", authController.recuperarSenha);

// Rota para redefinir senha
router.post("/redefinir-senha", authController.redefinirSenha);

router.post("/logout", authController.logout);

router.get('/me', authMiddleware, isTecnicoOrAdmin, (req, res) => {
    res.json({ user: req.usuario });
});

module.exports = router;