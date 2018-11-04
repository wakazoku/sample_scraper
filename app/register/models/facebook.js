'use strict';
module.exports = (sequelize, DataTypes) => {
  const Facebook = sequelize.define('Facebook', {
    article_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, { underscored: true });
  Facebook.associate = function (models) {
    // associations can be defined here
    Facebook.hasOne(models.Article, { "foreignKey": "id" });
  };
  return Facebook;
};