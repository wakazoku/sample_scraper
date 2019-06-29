'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Twitters', [{
      article_id: '1',
      count: '8',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    },
    {
      article_id: '2',
      count: '23',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }, {
      article_id: '3',
      count: '6',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Twitters', null, {});
  }
};