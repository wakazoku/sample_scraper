'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Articles', [{
      target_id: '1',
      title: 'Webディレクターにおすすめする「Visual Studio Code」のプラグイン5選 | 東京上野のWeb制作会社LIG',
      detail: 'test',
      post_date: '2018-11-05',
      post_url: 'https://liginc.co.jp/425707',
      author: 'Jack',
      categories: 'Web制作',
      createdAt: '2018-11-05',
      updatedAt: '2018-11-05'
    },
    {
      target_id: '1',
      title: 'LIGが新サービス「door」をリリース！ インフルエンサーへの拡散依頼が簡単に！ | 東京上野のWeb制作会社LIG',
      detail: 'test',
      post_date: '2018-11-05',
      post_url: 'https://liginc.co.jp/433915',
      author: 'LIGブログ編集部',
      categories: 'お知らせ/募集;ニュースリリース;Webサービス',
      createdAt: '2018-11-05',
      updatedAt: '2018-11-05'
    }, {
      target_id: '1',
      title: '【大人の基礎英語】バージン・イングリッシュ#3 | 東京上野のWeb制作会社LIG',
      detail: 'test',
      post_date: '2018-11-05',
      post_url: 'https://liginc.co.jp/434651',
      author: 'LIG動画制作部',
      categories: '動画',
      createdAt: '2018-11-05',
      updatedAt: '2018-11-05'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Articles', null, {});
  }
};
