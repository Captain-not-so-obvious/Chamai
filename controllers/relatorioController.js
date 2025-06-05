const db = require("../models");
const { Usuario, Chamado, Historico } = db;
const { Op } = require("sequelize");

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

const relatorioTempoResolucao = async (req, res) => {
    const { tecnicoId, dataInicio, dataFim } = req.query;

    try {
        const where = {
            status: 'resolvido',
        };

        if (tecnicoId) {
            where.tecnicoId = tecnicoId;
        }

        if (dataInicio && dataFim) {
            where.dataFechamento = {
                [Op.between]: [new Date(`${dataInicio}T00:00:00.000-03:00`), new Date(`${dataFim}T23:59:59.999-03:00`)]
            };
        }

        const chamados = await Chamado.findAll({
            where,
            include: [{ model:Usuario, as: 'tecnico', attributes: ['nome'] }],
        });

        const resultados = {};

        chamados.forEach(chamado => {
            const inicio = new Date(chamado.createdAt);
            const fim = new Date(chamado.dataFechamento);
            const duracaoHoras = (fim - inicio) / (1000 * 60 *60);

            const tecnicoNome = chamado.tecnico?.nome || "Sem técnico";

            if (!resultados[tecnicoNome]) {
                resultados[tecnicoNome] = { total: 0, somaHoras: 0 };
            }

            resultados[tecnicoNome].total += 1;
            resultados[tecnicoNome].somaHoras += duracaoHoras;
        });

        const medias = Object.entries(resultados).map(([tecnico, dados]) => ({
            tecnico,
            mediaResolucaoHoras: (dados.somaHoras / dados.total).toFixed(2),
            chamadosResolvidos: dados.total
        }));

        res.json(medias);
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        res.status(500).json({ message: "Erro ao gerar relatório" });
    }
};

module.exports = {
    listarChamadosResolvidosComHistorico,
    relatorioTempoResolucao,
};
