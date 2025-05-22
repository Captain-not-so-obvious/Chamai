module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("Usuario", {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: true, // Usado apenas para técnicos
        },
        tipo: {
            type: DataTypes.ENUM("usuario", "tecnico", "admin"),
            defaultValue: "usuario",
        },
        setor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.Chamado, { foreignKey: "usuarioId", as: "chamados" });
        Usuario.hasMany(models.Chamado, { foreignKey: "tecnicoId", as: "chamadosTecnico" });
    };

    return Usuario;
};