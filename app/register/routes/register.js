var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const param = {
    key: 'test',
    value: 'テストですよ'
  };
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(param);
});

module.exports = router;