'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Facebooks', [{
      article_id: '1',
      count: '1',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    },
    {
      article_id: '2',
      count: '4',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }, {
      article_id: '3',
      count: '0',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Facebooks', null, {});
  }
};
