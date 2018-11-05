'use strict';
module.exports = (sequelize, DataTypes) => {
  const Facebook = sequelize.define('Facebook', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true, createdAt: 'createdAt', updatedAt: 'updatedAt', });
  Facebook.associate = function (models) {
    Facebook.hasOne(models.Article, {
      targetKey: "article_id", foreignKey: "id"
    });
  };
  return Facebook;
};