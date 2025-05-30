const db = require("../models");
const { Usuario, Chamado, Historico } = db;
const { Op } = require("sequelize");

const criarChamado = async (req, res) => {
    const { solicitanteNome, solicitanteEmail, titulo, descricao, prioridade } = req.body;

    if (!solicitanteNome || !solicitanteEmail || !titulo || !descricao || !prioridade) {
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
        let chamados;
        if (usuarioId) {
            chamados = await Chamado.findAll({ where: { usuarioId } });
        } else if (status) {
            chamados = await Chamado.findAll({ where: { status } });
        } else {
            chamados = await Chamado.findAll();
        }

        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar chamados', error });
    }
};

const listarChamadosPorUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const chamados = await Chamado.findAll({ where: { usuarioId: id } });
        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar chamados por usuário", error });
    }
};

const listarChamadosPorStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const chamados = await Chamado.findAll({ where: { status } });
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

const listarChamadosResolvidosComHistorico = async (req, res) => {
  const { tecnicoId, dataInicio, dataFim } = req.query;

  try {
    const where = {
      status: 'resolvido',
    };

    if (tecnicoId) {
      where.tecnicoId = tecnicoId;
    }

    if (dataInicio && dataFim) {
      const dataInicioFiltro = new Date(`${dataInicio}T00:00:00.000-03:00`);
      const dataFimFiltro = new Date(`${dataFim}T23:59:59.999-03:00`);

      where.dataFechamento = {
        [Op.between]: [dataInicioFiltro, dataFimFiltro],
      };
    }

    const chamados = await Chamado.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: "tecnico",
          attributes: ["id", "nome"],
        },
        {
          model: Usuario,
          as: "solicitante",
          attributes: ["id", "nome"],
        },
        {
          model: Historico,
          as: "historico",
          include: [
            {
              model: Usuario,
              as: "Usuario",
              attributes: ["id", "nome"],
            },
          ],
        },
      ],
      order: [["dataFechamento", "DESC"]],
    });

    res.json(chamados);
  } catch (error) {
    console.error("Erro ao listar chamados resolvidos:", error);
    res.status(500).json({ message: "Erro ao listar chamados resolvidos", error });
  }
};

module.exports = {
    criarChamado,
    resolverChamado,
    listarChamados,
    listarChamadosPorUsuario,
    listarChamadosPorStatus,
    listarChamadosResolvidosComHistorico,
    atribuirTecnico,
};
