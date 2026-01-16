const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add type column with ENUM
    await queryInterface.sequelize.query(`
      CREATE TYPE comment_type AS ENUM ('public', 'internal', 'system');
    `);

    await queryInterface.addColumn('comments', 'type', {
      type: DataTypes.ENUM('public', 'internal', 'system'),
      allowNull: false,
      defaultValue: 'public',
    });

    // Migrate existing data: is_internal = true -> type = 'internal', else 'public'
    await queryInterface.sequelize.query(`
      UPDATE comments SET type = CASE 
        WHEN is_internal = true THEN 'internal'::comment_type
        ELSE 'public'::comment_type
      END;
    `);

    // Add new columns
    await queryInterface.addColumn('comments', 'is_edited', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('comments', 'edited_at', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('comments', 'metadata', {
      type: DataTypes.JSONB,
      allowNull: true,
    });

    // Add deleted_at for soft delete (paranoid)
    await queryInterface.addColumn('comments', 'deleted_at', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    // Can optionally remove is_internal column if not needed
    // await queryInterface.removeColumn('comments', 'is_internal');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns
    await queryInterface.removeColumn('comments', 'deleted_at');
    await queryInterface.removeColumn('comments', 'metadata');
    await queryInterface.removeColumn('comments', 'edited_at');
    await queryInterface.removeColumn('comments', 'is_edited');
    await queryInterface.removeColumn('comments', 'type');

    // Drop ENUM type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS comment_type;
    `);
  },
};
