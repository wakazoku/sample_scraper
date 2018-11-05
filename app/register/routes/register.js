var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  const param = {
    key: 'test',
    value: 'テストですよ'
  };
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(param);
});
router.get('/article', function (req, res, next) {
  models.Article.findAll().then(articles => {
    res.send(articles);
  })
});
router.get('/article/1', function (req, res, next) {
  models.Article.findAll({
    include: [
      {
        model: models.Twitter,
        required: false
      },
      {
        model: models.Facebook,
        required: false
      },
      {
        model: models.Hatena,
        required: false
      }
    ]
  }).then(article => {
    res.send(article)
  })
});
router.get('/target/1', function (req, res, next) {
  models.Target.findAll({
    // include: [
    //   {
    //     model: models.Article,
    //     required: false,
    //     include: [
    //       {
    //         model: models.Twitter,
    //         required: false
    //       },
    //       {
    //         model: models.Facebook,
    //         required: false
    //       },
    //       {
    //         model: models.Hatena,
    //         required: false
    //       }
    //     ]
    //   }
    // ]
    include: [{ all: true }] // 1行で書くとこう
  }).then(target => {
    res.send(target)
  })
});

module.exports = router;