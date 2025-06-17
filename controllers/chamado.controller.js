const db = require("../models");
const { Usuario, Chamado, Historico } = db;
const { Op, fn, col } = require("sequelize");

const criarChamado = async (req, res) => {
    const { solicitanteNome, solicitanteEmail, titulo, descricao, prioridade, setor } = req.body;

    if (!solicitanteNome || !solicitanteEmail || !titulo || !descricao || !prioridade || !setor) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
        let usuario = await Usuario.findOne({ where: { email: solicitanteEmail } });

        if (!usuario) {
            usuario = await Usuario.create({
                nome: solicitanteNome,
                email: solicitanteEmail,
                tipo: "usuario",
            });
        }

        const chamado = await Chamado.create({
            titulo,
            descricao,
            prioridade,
            setor,
            usuarioId: usuario.id
        });

        await Historico.create({
            chamadoId: chamado.id,
            descricao: "Chamado criado pelo solicitante",
            autorId: usuario.id,
        });

        res.status(201).json({ message: "Chamado criado com sucesso", chamado });
    } catch (error) {
        console.error("Erro ao criar chamado:", error);
        res.status(500).json({ message: "Erro interno ao criar chamado" });
    }
};

const { enviarEmailChamadoResolvido } = require("../services/email.service");

const resolverChamado = async (req, res) => {
    const chamadoId = req.params.id;

    try {
        const chamado = await Chamado.findByPk(chamadoId, {
            include: [{ model: Usuario, as: "solicitante" }],
        });

        if (!chamado) {
            return res.status(404).json({ message: "Chamado não encontrado" });
        }

        // Atribui automaticamente o técnico que está resolvendo, se ainda não houver técnico atribuído
        if (!chamado.tecnicoId) {
            chamado.tecnicoId = req.usuario.id;
        }

        chamado.status = "resolvido";
        chamado.dataFechamento = new Date();
        await chamado.save();

        await Historico.create({
            chamadoId: chamado.id,
            descricao: "Chamado resolvido",
            autorId: req.usuario.id,
        });

        await enviarEmailChamadoResolvido(
            chamado.solicitante.email,
            chamado.solicitante.nome,
            chamado.titulo
        );

        res.json({ message: "Chamado resolvido e e-mail enviado com sucesso" });
    } catch (error) {
        console.error("Erro ao resolver chamado:", error);
        res.status(500).json({ message: "Erro ao resolver chamado" });
    }
};

const listarChamados = async (req, res) => {
    const { usuarioId, status } = req.query;

    try {
        let where = {};
        if (usuarioId) where.usuarioId = usuarioId;
        if (status) where.status = status;

        const chamados = await Chamado.findAll({
            where,
            include: [{ model: Usuario, as: "solicitante" }]
        });

        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar chamados', error });
    }
};

const listarChamadosPorUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const chamados = await Chamado.findAll({
            where: { usuarioId: id },
            include: [{ model: Usuario, as: "solicitante" }]
        });
        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar chamados por usuário", error });
    }
};

const listarChamadosPorStatus = async (req, res) => {
  const { status } = req.params;
  const { usuarioId, setor } = req.query;

  try {
    let where = { status };

    if (usuarioId) where.usuarioId = Number(usuarioId);
    if (setor) where.setor = setor;

    const chamados = await Chamado.findAll({
      where,
      include: [{ model: Usuario, as: "solicitante" }],
      order: [["dataAbertura", "DESC"]], // Ordena por data de abertura decrescente
    });

    res.json(chamados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar chamados por status", error });
  }
};

const atribuirTecnico = async (req, res) => {
    const { id } = req.params;
    const { tecnicoId } = req.body;

    try {
        const chamado = await Chamado.findByPk(id);
        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        chamado.tecnicoId = tecnicoId;
        await chamado.save();

        res.json({ message: 'Técnico atribuído com sucesso', chamado });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atribuir técnico', error });
    }
};

const listarSetoresDosChamados = async (req, res) => {
    try {
        const setores = await Chamado.findAll({
            attributes: [[fn("DISTINCT", col("setor")), "setor"]],
            raw: true,
        });

        const setoresUnicos = setores.map(s => s.setor);
        res.json(setoresUnicos);
    } catch (error) {
        console.error("Erro ao buscar setores dos chamados:", error);
        res.status(500).json({ error: "Erro ao buscar setores dos chamados" });
    }
};

const buscarChamadosComFiltros = async (req, res) => {
    const { setor, prioridade, status, termo } = req.query;

    let where = {};

    if (setor) where.setor = setor;
    if (prioridade) where.prioridade = prioridade;
    if (status) where.status = status;

    if (termo) {
        where[Op.or] = [
            { titulo: { [Op.iLike]: `%${termo}%` } },
            { descricao: { [Op.iLike]: `%${termo}%` } }
        ];
    }

    try {
        const chamados = await Chamado.findAll({
            where,
            include: [{ model: Usuario, as: "solicitante" }],
            order: [["dataAbertura", "DESC"]]
        });

        res.json(chamados);
    } catch (error) {
        console.error("Erro ao buscar chamados com filtro:", error);
        res.status(500).json({ message: "Erro interno ao buscar chamados" });
    }
};

module.exports = {
    criarChamado,
    resolverChamado,
    listarChamados,
    listarChamadosPorUsuario,
    listarChamadosPorStatus,
    atribuirTecnico,
    listarSetoresDosChamados,
    buscarChamadosComFiltros
};
