'use strict';
module.exports = (sequelize, DataTypes) => {
  const Target = sequelize.define('Target', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, { underscored: true });
  Target.associate = function (models) {
    // associations can be defined here
    Target.hasMany(models.Article, { "foreignKey": "target_id" });
  };
  return Target;
};