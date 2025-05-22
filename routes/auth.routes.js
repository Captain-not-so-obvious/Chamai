const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models/usuario.model");

router.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha inválida" });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ token });
});

module.exports = router;