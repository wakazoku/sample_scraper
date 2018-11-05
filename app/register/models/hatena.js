'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hatena = sequelize.define('Hatena', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true, createdAt: 'createdAt', updatedAt: 'updatedAt', });
  Hatena.associate = function (models) {
    Hatena.hasOne(models.Article, {
      targetKey: "article_id", foreignKey: "id"
    });
  };
  return Hatena;
};