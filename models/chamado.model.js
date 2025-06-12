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
            type: DataTypes.ENUM("baixa", "media", "alta"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("aberto", "em_atendimento", "resolvido"),
            defaultValue: "aberto",
        },
        dataAbertura: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dataFechamento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
               setor: {
            type: DataTypes.STRING,
            allowNull: false,
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
        Chamado.hasMany(models.Historico, { foreignKey: "chamadoId", as: "historico" });
    };

    return Chamado;
};