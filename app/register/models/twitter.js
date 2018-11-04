'use strict';
module.exports = (sequelize, DataTypes) => {
  const Twitter = sequelize.define('Twitter', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true });
  Twitter.associate = function (models) {
    // associations can be defined here
    Twitter.hasOne(models.Article, { "foreignKey": "id" });
  };
  return Twitter;
};