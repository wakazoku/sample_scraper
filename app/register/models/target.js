'use strict';
module.exports = (sequelize, DataTypes) => {
  const Target = sequelize.define('Target', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, { underscored: true, createdAt: 'createdAt', updatedAt: 'updatedAt', });
  Target.associate = function (models) {
    Target.hasMany(models.Article, {
      targetKey: "id", foreignKey: "target_id"
    });
  };
  return Target;
};