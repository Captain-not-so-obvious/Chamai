'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Passo 1: Adicionar a coluna tecnicoDirecionadoId
    await queryInterface.addColumn('Chamados', 'tecnicoDirecionadoId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });

    // Passo 2: Adicionar a chave estrangeira separadamente
    await queryInterface.addConstraint('Chamados', {
      fields: ['tecnicoDirecionadoId'],
      type: 'foreign key',
      name: 'fk_chamados_tecnicodirecionadoid',
      references: {
        table: 'Usuarios',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Passo 3: Atualizar a coluna de status
    await queryInterface.changeColumn('Chamados', 'status', {
      // ⬅️ CORRIGIDO: Agora usando a lista de status que você especificou
      type: Sequelize.ENUM('aberto', 'aguardando_atribuicao', 'em_atendimento', 'resolvido'),
      allowNull: false,
      defaultValue: 'aberto'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter a mudança
    await queryInterface.removeConstraint('Chamados', 'fk_chamados_tecnicodirecionadoid');
    await queryInterface.removeColumn('Chamados', 'tecnicoDirecionadoId');
    await queryInterface.changeColumn('Chamados', 'status', {
      type: Sequelize.ENUM('aberto', 'em_atendimento', 'resolvido'),
      allowNull: false,
      defaultValue: 'aberto'
    });
  }
};