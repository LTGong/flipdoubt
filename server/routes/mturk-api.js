var express = require('express');
var router = express.Router();

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

// simple API call, no authentication or user info
router.get('/transform', function(req, res, next) {

    res.json({
      message: 'HAPPY THOUGHTS'
    });
  });

module.exports = router;
