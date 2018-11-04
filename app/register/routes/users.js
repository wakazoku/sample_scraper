var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function (req, res, next) {
  models.User.findById(1).then(users => {
    res.send(users);
  })
});

module.exports = router;