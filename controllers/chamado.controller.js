const db = require("../models");
const { Usuario, Chamado, Historico } = db;
const { Op, fn, col } = require("sequelize");
const { enviarEmailChamadoResolvido, enviarEmailChamadoAtualizado, enviarEmailChamadoAberto } = require("../services/email.service");

// Reuso dos includes padrão
const chamadoIncludes = [
    {
        model: Usuario,
        as: "solicitante",
        attributes: ["nome", "setor"]
    },
    {
        model: Usuario,
        as: "tecnico",
        attributes: ["nome"]
    },
    {
        model: Usuario,
        as: "tecnicoDirecionado",
        attributes: ["nome"]
    }
];

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
                setor,
            });
        }

        const chamado = await Chamado.create({
            titulo,
            descricao,
            prioridade,
            setor,
            usuarioId: usuario.id,
            status: "aberto",
            tecnicoDirecionadoId: null,
            tecnicoId: null,
        });

        await Historico.create({
            chamadoId: chamado.id,
            descricao: "Chamado criado pelo solicitante",
            autorId: usuario.id,
        });

        await enviarEmailChamadoAberto(
            solicitanteEmail,
            solicitanteNome,
            chamado.id,
            chamado.titulo
        );

        res.status(201).json({ message: "Chamado criado com sucesso", chamado });
    } catch (error) {
        console.error("Erro ao criar chamado:", error);
        res.status(500).json({ message: "Erro interno ao criar chamado" });
    }
};

const resolverChamado = async (req, res) => {
    const chamadoId = req.params.id;

    try {
        const chamado = await Chamado.findByPk(chamadoId, {
            include: [{ model: Usuario, as: "solicitante" }]
        });

        if (!chamado) {
            return res.status(404).json({ message: "Chamado não encontrado" });
        }

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
            include: chamadoIncludes,
            order: [["dataAbertura", "DESC"]]
        });

        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar chamados', error });
    }
};

const listarMeusChamados = async (req, res) => {
    const tecnicoId = req.usuario.id;

    try {
        const meusChamados = await Chamado.findAll({
            where: {
                [Op.or]: [
                    // Chamados que foram direcionados ao técnico, mas que ainda não foram atribuídos
                    { tecnicoDirecionadoId: tecnicoId, status: "aguardando_atribuicao" },
                    // Chamados que o técnico já está atendendo
                    { tecnicoId: tecnicoId, status: "em_atendimento"},
                ],
            },
            include: [
                { model: Usuario, as: 'solicitante', attributes: ['nome', 'setor'] },
                { model: Usuario, as: 'tecnico', attributes: ['nome'] },
                { model: Usuario, as: 'tecnicoDirecionado', attributes: ['nome'] },
            ],
            // Ordenar por prioridade e depois por data de abertura
            order: [['prioridade', 'DESC'], ['dataAbertura', 'ASC']],
        });

        res.json(meusChamados);
    } catch (error) {
        console.error("Erro ao buscar meus chamados:", error);
        res.status(500).json({ message: "Erro ao buscar meus chamados." });
    }
};

const listarChamadosPorUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const chamados = await Chamado.findAll({
            where: { usuarioId: id },
            include: chamadoIncludes,
            order: [["dataAbertura", "DESC"]]
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
            include: chamadoIncludes,
            order: [["dataAbertura", "DESC"]]
        });

        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar chamados por status", error });
    }
};

const atribuirTecnico = async (req, res) => {
    const { id } = req.params;
    const tecnicoId = req.usuario.id;

    try {
        const chamado = await Chamado.findByPk(id, {
            include: [
                { model: Usuario, as: "solicitante" }
            ],
        });

        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        if (chamado.status !== "aguardando_atribuicao") {
            return res.status(400).json({ message: "O chamado não pode ser atribuído no momento. Status incorreto." });
        }

        if (chamado.tecnicoDirecionadoId !== tecnicoId) {
            return res.status(403).json({ message: "Acesso negado. Este chamado não foi direcionado a você." })
        }

        await chamado.update({
            tecnicoId: tecnicoId,
            status: "em_atendimento",
            dataExecucao: new Date(),
        });

        await Historico.create({
            chamadoId: chamadoId,
            descricao: `Chamado atribuído ao técnico ${req.usuario.nome}.`,
            autorId: tecnicoId,
        });

        const mensagemAtualizacao = `Seu chamado foi atribuído ao técnico ${req.usuario.nome}.`;
        await enviarEmailChamadoAtualizado(
            chamado.solicitante.email,
            chamado.solicitante.nome,
            chamado.id,
            mensagemAtualizacao
        );

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
            include: chamadoIncludes,
            order: [["dataAbertura", "DESC"]]
        });

        res.json(chamados);
    } catch (error) {
        console.error("Erro ao buscar chamados com filtro:", error);
        res.status(500).json({ message: "Erro interno ao buscar chamados" });
    }
};

const alterarPrioridade = async (req, res) => {
    const chamadoId = req.params.id;
    const { prioridade } = req.body;

    const prioridadesValidas = ["baixa", "media", "alta", "critica"];

    if (!prioridadesValidas.includes(prioridade)) {
        return res.status(400).json({ mensagem: "Prioridade Inválida" });
    }

    try {
        const chamado = await Chamado.findByPk(chamadoId);

        if (!chamado) {
            return res.status(404).json({ mensagem: "Chamado não encontrado" });
        }

        if (chamado.status === "resolvido") {
            return res.status(400).json({ mensagem: "Não é possível alterar a prioridade de um chamado resolvido" });
        }

        await chamado.update({ prioridade });

        return res.status(200).json({ mensagem: "Prioridade atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao alterar prioridade:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const direcionarChamado = async (req, res) => {
    const { id } = req.params;
    const { tecnicoId } = req.body;

    try {
        if (req.usuario.tipo !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem direcionar chamados.' })
        }

        const chamado = await Chamado.findByPk(id);

        if (!chamado) {
            return res.status(404).json({ message: "Chamado não Encontrado" });
        }

        // Atualiza o status e o técnico direcionado
        await chamado.update({
            status: 'aguardando_atribuicao',
            tecnicoDirecionadoId: tecnicoId,
        });

        return res.status(200).json({
            message: 'Chamado Direcionado com sucesso.',
        });

    } catch (error) {
        console.error('Erro ao direcionar chamado:', error);
        res.status(500).json({ message: 'Erro ao direcionar chamado:', error });
    }
};

module.exports = {
    criarChamado,
    resolverChamado,
    listarChamados,
    listarMeusChamados,
    listarChamadosPorUsuario,
    listarChamadosPorStatus,
    atribuirTecnico,
    listarSetoresDosChamados,
    buscarChamadosComFiltros,
    alterarPrioridade,
    direcionarChamado
};
