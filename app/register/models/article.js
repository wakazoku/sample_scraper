'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    target_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    detail: DataTypes.TEXT,
    post_date: DataTypes.DATE,
    post_url: DataTypes.STRING,
    author: DataTypes.STRING,
    categories: DataTypes.STRING,
  }, { underscored: true, createdAt: 'createdAt', updatedAt: 'updatedAt', });
  Article.associate = function (models) {
    // Article.belongsTo(models.Target, {
    //   targetKey: "target_id", foreignKey: "id"
    // });
    Article.hasOne(models.Twitter, {
      targetKey: "id", foreignKey: "article_id"
    });
    Article.hasOne(models.Facebook, {
      targetKey: "id", foreignKey: "article_id"
    });
    Article.hasOne(models.Hatena, {
      targetKey: "id", foreignKey: "article_id"
    });
  };
  return Article;
};