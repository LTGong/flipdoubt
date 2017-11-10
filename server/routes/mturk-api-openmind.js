var express = require('express');
var mturk = require('mturk-api');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var xmlExtractor = require('xml-extract');
const asyncMiddleware = require('../utils/asyncMiddleware');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

var config = {
    access : 'AKIAINJT6YTLRJMBWOWA',
    secret : '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',
    sandbox: true
}

router.post('/transform', checkJwt, function(req, res, next) {
  console.log('In mturk-api TRANSFORM');

  mturk.createClient(config)
  .then(function(api){
    console.log('In createClient-transform');

    fs.readFile(__dirname + '/../templates/HTMLQuestion.xml', 'utf8', function(err, unescapedXML){
      if(err){console.error(err);return}

      var neg_thought = req.body.thoughtText;
      var tag = '%%THOUGHT.TAG%%';
      unescapedXML = unescapedXML.replace(tag, neg_thought);

      // HIT options
      var params = {
        Title: "Re-write a negative sentence with a positive spin.",
        Description: "You will read a sentence that represents a negative personal thought, and help to reframe the thought as a more positive one.",
        Keywords: "writing, editing, help, psychology",
        Question: _.escape(unescapedXML),//IMPORTANT: XML NEEDS TO BE ESCAPED!
        AssignmentDurationInSeconds: 300, // Allow 5 minutes to answer
        AutoApprovalDelayInSeconds: 1,//86400 * 1, // 1 day auto approve
        MaxAssignments: 1, // 1 worker responses
        LifetimeInSeconds: 86400 * 1, // Expire in 1 day
        Reward: {CurrencyCode:'USD', Amount:0.10}
      };

      //CREATE HIT
      api.req('CreateHIT', params)
        .then(function(results){
          console.log('server: after CreateHIT');
          var returned_turk_data = {
            HITId : results.HIT[0].HITId,
            HITTypeId : results.HIT[0].HITTypeId
          }
          //console.log(returned_turk_data);
          res.status(200).send(returned_turk_data);
        })
        .catch(console.error)
    });
  });
});

router.post('/check-hits', asyncMiddleware(async function(req, res, next) {
  console.log('In check-hits.');
  const api = await mturk.createClient(config);

  let HITIDs = req.body.HITIds,
      numHits = HITIDs.length;

  let promises = [];
  for (i=0; i < numHits; i++) {
    let HITId = HITIDs[i];
    console.log('API Request for HIT', HITId, 'sent');
    promises.push(api.req('GetAssignmentsForHIT', {HITId: HITId}));
  }
  let results = await Promise.all(promises);

  let updates = [];
  _.forEach(results, (result) => {
    _.forEach(result.GetAssignmentsForHITResult[0].Assignment, (assignment) => {
      let HITId = assignment.HITId;
      let xml = assignment.Answer;
      xmlExtractor(xml, 'FreeText', true, (error, element) => {
        if (error) {throw new Error(error);}
        element = element.replace("<FreeText>", "");
        element = element.replace("</FreeText>", "");
        updates.push({
          "HITId" : HITId,
          "pos_thought" : element
        });
      });
    });
  });
  console.log('Updates to send to the client\n', updates);
  res.status(200).send(updates);
}));

module.exports = router;
