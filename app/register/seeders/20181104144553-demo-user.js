'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      firstName: 'Doe',
      email: 'john@mail.com',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    },
    {
      firstName: 'Taro',
      firstName: 'Kikuchi',
      email: 'taro@mail.com',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'

    }, {
      firstName: 'Rainbow',
      firstName: 'Mika',
      email: 'rainbow@mail.com',
      createdAt: '2018-01-01',
      updatedAt: '2018-01-01'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
