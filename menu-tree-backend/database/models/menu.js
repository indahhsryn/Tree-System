'use strict';
module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    'Menu',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'menus',
      underscored: true,
    },
  );

  Menu.associate = models => {
    Menu.belongsTo(models.Menu, {
      as: 'parent',
      foreignKey: 'parent_id',
    });

    Menu.hasMany(models.Menu, {
      as: 'children',
      foreignKey: 'parent_id',
    });
  };

  return Menu;
};
