module.exports = (sequelize, DataTypes) => {
    const Chamado = sequelize.define("Chamado", {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        prioridade: {
            type: DataTypes.ENUM("baixa", "media", "alta", "critica"),
            allowNull: false,
            defaultValue: "baixa",
        },
        status: {
            type: DataTypes.ENUM("aberto", "aguardando_atribuicao", "em_atendimento", "resolvido"),
            allowNull: false,
            defaultValue: "aberto",
        },
        tecnicoDirecionadoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
            },
            allowNull: true,
            defaultValue: null,
        },
        dataAbertura: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dataExecucao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        dataFechamento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        setor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tecnicoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });

    Chamado.associate = (models) => {
        Chamado.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "solicitante" });
        Chamado.belongsTo(models.Usuario, { foreignKey: "tecnicoId", as: "tecnico" });
        Chamado.belongsTo(models.Usuario, { foreignKey: "tecnicoDirecionadoId", as: "tecnicoDirecionado" });
        Chamado.hasMany(models.Historico, { foreignKey: "chamadoId", as: "historico" });
    };

    return Chamado;
};