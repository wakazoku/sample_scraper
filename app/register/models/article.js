'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    target_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    detail: DataTypes.TEXT,
    post_date: DataTypes.DATE,
    post_url: DataTypes.STRING,
    author: DataTypes.STRING,
    categories: DataTypes.STRING
  }, { underscored: true });
  Article.associate = function (models) {
    // associations can be defined here
    Article.belongsTo(models.Target, { "foreignKey": "id" });
    Article.hasOne(models.Twitter, { "foreignKey": "article_id" });
    Article.hasOne(models.Facebook, { "foreignKey": "article_id" });
    Article.hasOne(models.Hatena, { "foreignKey": "article_id" });
  };
  return Article;
};