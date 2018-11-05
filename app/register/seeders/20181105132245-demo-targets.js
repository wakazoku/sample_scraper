'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Targets', [{
      name: '株式会社LIG',
      url: 'https://liginc.co.jp/blog',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Targets', null, {});
  }
};
