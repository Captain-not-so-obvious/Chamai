module.exports = (sequelize, DataTypes) => {
    const Historico = sequelize.define("Historico", {
        dataEvento: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    Historico.associate = (models) => {
        Historico.belongsTo(models.Chamado, { foreignKey: "chamadoId" });
        Historico.belongsTo(models.Usuario, { foreignKey: "autorId" });
    };

    return Historico;
};