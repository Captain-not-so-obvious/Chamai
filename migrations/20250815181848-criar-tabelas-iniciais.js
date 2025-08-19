'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tabela Usuarios
    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      tipo: { type: Sequelize.ENUM('usuario', 'tecnico', 'admin'), allowNull: false, defaultValue: 'usuario' },
      setor: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    // Tabela Chamados
    await queryInterface.createTable('Chamados', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: { type: Sequelize.STRING, allowNull: false },
      descricao: { type: Sequelize.TEXT, allowNull: false },
      prioridade: { type: Sequelize.ENUM('baixa', 'media', 'alta', 'critica'), allowNull: false, defaultValue: 'baixa' },
      status: { type: Sequelize.ENUM('aberto', 'aguardando_atribuicao', 'em_atendimento', 'resolvido'), allowNull: false, defaultValue: 'aberto' },
      dataAbertura: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      dataExecucao: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
      dataFechamento: { type: Sequelize.DATE, allowNull: true },
      setor: { type: Sequelize.STRING, allowNull: true },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      tecnicoId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      tecnicoDirecionadoId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    // Tabela Historicos
    await queryInterface.createTable('Historicos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      descricao: { type: Sequelize.TEXT, allowNull: false },
      dataEvento: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      chamadoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Chamados', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      autorId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Historicos');
    await queryInterface.dropTable('Chamados');
    await queryInterface.dropTable('Usuarios');
  }
};