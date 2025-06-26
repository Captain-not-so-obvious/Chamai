const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const Usuario = db.Usuario;

const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, tipo, setor } = req.body;

        // Verifica se o e-mail já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ erro: "E-mail já cadastrado." });
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria o usuário
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            tipo,
            setor,
        });

        res.status(201).json({
            mensagem: "Usuário criado com sucesso!",
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                tipo: novoUsuario.tipo,
                setor: novoUsuario.setor
            }
        });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ erro: "Erro ao criar usuário." });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        if (!usuario.senha) {
            return res.status(500).json({ erro: "Senha do usuário não encontrada." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha incorreta." });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ mensagem: "Login realizado com sucesso.", token });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ erro: "Erro ao fazer login." });
    }
};


const listarUsuarios = async (req, res) => {
    const { tipo } = req.query;

    const where = {};
    if (tipo) {
        where.tipo = tipo.toLowerCase();
    }

    try {
        const usuarios = await Usuario.findAll({
            where,
            attributes: ["id", "nome", "email", "tipo"]
        });
        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};

const listarTecnicos = async (req, res) => {
    try {
        const tecnicos = await Usuario.findAll({
            where: { tipo: "tecnico" },
            attributes: ["id", "nome"]
        });
        res.json(tecnicos);
    } catch (error) {
        console.error("Erro ao buscar técnicos", error);
        res.status(500).json({ mensagem: "Erro ao buscar técnicos" });
    }
};

const criarTecnico = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios" });
    }

    try {
        const tecnicoExistente = await Usuario.findOne({ where: { email } });
        if (tecnicoExistente) {
            return res.status(400).json({ mensagem: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const tecnico = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            tipo: "tecnico"
        });

        return res.status(201).json({ mensagem: "Técnico cadastrado com sucesso", tecnico });
    } catch (error) {
        console.error("Erro ao criar técnico:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = {
    criarUsuario,
    login,
    listarUsuarios,
    listarTecnicos,
    criarTecnico
};