'use strict';
module.exports = (sequelize, DataTypes) => {
  const Twitter = sequelize.define('Twitter', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true, createdAt: 'createdAt', updatedAt: 'updatedAt', });
  Twitter.associate = function (models) {
    Twitter.hasOne(models.Article, {
      targetKey: "article_id", foreignKey: "id"
    });
  };
  return Twitter;
};