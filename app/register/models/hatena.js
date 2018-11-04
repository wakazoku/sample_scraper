'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hatena = sequelize.define('Hatena', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true });
  Hatena.associate = function (models) {
    // associations can be defined here
    Hatena.hasOne(models.Article, { "foreignKey": "id" });
  };
  return Hatena;
};