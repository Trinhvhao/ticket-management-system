module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add embedding column to knowledge_articles table
    await queryInterface.addColumn('knowledge_articles', 'embedding', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JSON string of embedding vector (384 dimensions)',
    });

    console.log('✅ Added embedding column to knowledge_articles table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('knowledge_articles', 'embedding');
    console.log('✅ Removed embedding column from knowledge_articles table');
  },
};
