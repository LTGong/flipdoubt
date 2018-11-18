var express = require('express');
var mturk = require('mturk-api');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var xmlExtractor = require('xml-extract');
const asyncMiddleware = require('../utils/asyncMiddleware');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

var config =  {
  access: 'AKIAJWCXZOXP7EJZYXGQ',
  secret: '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',
  sandbox: false
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
      unescapedXML = unescapedXML.replace('&#13;', ' ');

      // HIT options
      var params = {
        Title: "Re-write a negative sentence with a positive but still realistic spin.",
        Description: "Read a sentence that represents a negative personal thought, and help to reframe the thought as a more positive but still realistic one.",
        Keywords: "writing, editing, help, psychology, motivation",
        Question: _.escape(unescapedXML),//IMPORTANT: XML NEEDS TO BE ESCAPED!
        AssignmentDurationInSeconds: 300, // Allow 5 minutes to answer
        AutoApprovalDelayInSeconds: 86400 * 7, // 1 week auto approve
        MaxAssignments: 1, // 1 worker responses
        LifetimeInSeconds: 86400 * 1, // Expire in 1 day
        Reward: {CurrencyCode:'USD', Amount:0.05}
      };

      var promises = [];
      for (i=0; i < 3; i++) {
        promises.push(api.req('CreateHIT', params));
      }

      Promise.all(promises).then(results => {
        var returned_turk_responses = [];
        _.forEach(results, (result) => {
          console.log('server: after CreateHIT');
          var returned_turk_data = {
            HITId: result.HIT[0].HITId,
            HITTypeId: result.HIT[0].HITTypeId
          }
          console.log(returned_turk_data);
          returned_turk_responses.push(returned_turk_data);
        })
        res.status(200).send(returned_turk_responses);
      })
    });
  });
});

router.post('/check-hits', asyncMiddleware(async function(req, res, next) {
  console.log('In check-hits.');
  const api = await mturk.createClient(config);

  let HITIDs = req.body.HITIds,
      numHits = HITIDs.length;

  console.log("HITIDs: " + req.body.HITIds);
  console.log("numHits: " + req.body.HITIds.length);

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
