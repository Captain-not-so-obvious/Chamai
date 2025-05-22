const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Usuario } = require("../models/usuario.model");

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha inválida" });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo,
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no login" });
    }
};

module.exports = { login };