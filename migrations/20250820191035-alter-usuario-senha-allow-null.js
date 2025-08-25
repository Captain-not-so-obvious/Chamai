'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Altera a coluna 'senha' na tabela 'Usuarios' para permitir valores nulos
    await queryInterface.changeColumn('Usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Opcional: reverte a mudança, tornando a coluna 'senha' NOT NULL novamente
    await queryInterface.changeColumn('Usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};