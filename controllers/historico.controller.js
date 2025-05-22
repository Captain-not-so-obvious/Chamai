const { Historico, Usuario, Chamado } = require("../models");

const historicoController = {
    async listarHistoricoPorChamado(req, res) {
        const { chamadoId } = req.params;

        try {
            const historico = await Historico.findAll({
                where: { chamadoId },
                include: [
                    {
                        model: Usuario,
                        attributes: ["id", "nome", "email"]
                    }
                ],
                order: [["createdAt", "ASC"]],
            });

            if (!historico.length) {
                return res.status(404).json({ message: "Nenhum histórico para esse chamado" });
            }

            res.json(historico);
        } catch (error) {
            console.error("Erro ao listar histórico:", error);
            res.status(500).json({ message: "Erro ao listar histórico", error: error.message || error.toString() });
        }
    },

    async adicionarComentario(req, res) {
        const { chamadoId } = req.params;
        const { descricao } = req.body;
        const autorId = req.usuario.id;

        try {
            const chamado = await Chamado.findByPk(chamadoId);
            if (!chamado) {
                return res.status(404).json({ message: "Chamado não encontrado" });
            }

            const historico = await Historico.create({
                chamadoId,
                autorId,
                descricao,
                dataEvento: new Date()
            });

            return res.status(201).json({
                message: "Comentário adicionado ao histórico",
                historico
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao adicionar comentário", error });
        }
    }
};

module.exports = historicoController;