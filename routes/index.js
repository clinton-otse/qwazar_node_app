/** @format */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('welcome to the api');
});

router.get('/form', function (req, res, next) {
  res.send('Google Form');
});

module.exports = router;
