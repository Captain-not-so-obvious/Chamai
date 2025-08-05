const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Usuario } = require("../models");
const { enviarEmailRecuperacaoSenha } = require("../services/email.service");

const SECRET = process.env.JWT_SECRET || "chave-secreta";

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

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 8 * 60 * 60 * 1000, // 8 horas
            path: '/',
            // secure: true // Descomentar em produção
            // sameSite: 'Lax' // Descomentar em produção
        });

        res.json({
            message: "Login bem-sucedido!",
            user: {
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo
            }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no login" });
    }
};

const recuperarSenha= async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });

        await enviarEmailRecuperacaoSenha(email, token);

        res.json({ message: "E-mail de recuperação enviado." });
    } catch (error) {
        console.error("Erro ao enviar e-mail de recuperação de senha:", error);
        res.status(500).json({ message: "Erro ao processar recuperação de senha." });
    }
};

const redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET);

        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não econtrado." });
        }

        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
        usuario.senha = senhaCriptografada;
        await usuario.save();

        res.json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: "Token inválido ou expirado." });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        path: '/',
        // secure: true // Descomentar em produção
        // sameSite: 'Lax' // Descomentar em produção
    });
    res.status(200).json({ message: "Logout bem-sucedido." });
};

module.exports = { login, recuperarSenha, redefinirSenha, logout };