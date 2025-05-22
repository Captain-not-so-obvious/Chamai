const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/db");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuario.model.js")(sequelize, DataTypes);
db.Chamado = require("./chamado.model.js")(sequelize, DataTypes);
db.Historico = require("./historico.model.js")(sequelize, DataTypes);

// associações
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;