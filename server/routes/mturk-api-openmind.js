var express = require('express');
var mturk = require('mturk-api');
var router = express.Router();
var fs = require('fs');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

var config = {
    access : 'AKIAINJT6YTLRJMBWOWA',
    secret : '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',
    sandbox: true
}

router.post('/transform', function(req, res, next) {

  console.log('server: In transform');

  mturk.createClient(config).then(function(api){

    console.log('server: in createClient');
    //Import an XML file. You can use one of our examples in the templates folder *
    fs.readFile(__dirname + '/../templates/HTMLQuestion.xml', 'utf8', function(err, unescapedXML){

      console.log('server: in readFile');
      if(err){console.error(err);return}

      //HIT options
      var params = {
        Title: "Create HIT Example",
        Description: "An example of how to create a HIT",
        Question: _.escape(unescapedXML),//IMPORTANT: XML NEEDS TO BE ESCAPED!
        AssignmentDurationInSeconds: 180, // Allow 3 minutes to answer
        AutoApprovalDelayInSeconds: 86400 * 1, // 1 day auto approve
        MaxAssignments: 100, // 100 worker responses
        LifetimeInSeconds: 86400 * 3, // Expire in 3 days
        Reward: {CurrencyCode:'USD', Amount:0.50}
      };

      api.req('CreateHIT', params).then(function(res){
        console.log('server: after CreateHIT');
        res.status(201).end()
      }).catch(console.error);
    }, (err)=> {
      console.log(err)
      res.status(507).send({message: err})
      })
  })
});

module.exports = router;
