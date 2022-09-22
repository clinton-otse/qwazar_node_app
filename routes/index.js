/** @format */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/google_forms', function (req, res, next) {
  res.json({body: req.body});
});

router.get('/form', function (req, res, next) {
  res.send('Google Form');
});

module.exports = router;
