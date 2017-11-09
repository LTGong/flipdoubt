var express = require('express');
var mturk = require('mturk-api');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
const asyncMiddleware = require('../utils/asyncMiddleware');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

var config = {
    access : 'AKIAINJT6YTLRJMBWOWA',
    secret : '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',
    sandbox: false
}

router.post('/transform', function(req, res, next) {
  console.log(req.body.thoughtText);
  mturk.createClient(config)
  .then(function(api){
    console.log('In createClient-transform');

    // api.req('GetAccountBalance')
    //   .then(function(res){
    //     console.log(res.GetAccountBalanceResult);
    //   })
    //   .catch(console.error);

    //Import an XML file. You can use one of our examples in the templates folder *
    fs.readFile(__dirname + '/../templates/HTMLQuestion.xml', 'utf8', function(err, unescapedXML){
      if(err){console.error(err);return}

      var neg_thought = req.body.thoughtText;
      var tag = '%%THOUGHT.TAG%%';
      unescapedXML = unescapedXML.replace(tag, neg_thought);
      // console.log(unescapedXML);

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
          console.log(returned_turk_data);
          res.status(200).send(returned_turk_data);
        })
        .catch(console.error)
    });
  });
});

router.post('/check-hits', asyncMiddleware(async function(req, res, next) {
  console.log('In check-hits.');

  var HITIDs = req.body.HITIds;
  let numHits = HITIDs.length;

  const api = await mturk.createClient(config);

  const reviewableHITs = await api.req('GetReviewableHITs');
  let newHITIDs = [];

  let i = 0;
  let NEWnumHits = reviewableHITs.GetReviewableHITsResult[0].HIT.length;
  for(i = 0; i < NEWnumHits; i++) {
    newHITIDs.push(reviewableHITs.GetReviewableHITsResult[0].HIT[i].HITId);
  }
  console.log(newHITIDs);
  console.log(HITIDs);

  let promises = [];
  for (i=0; i < numHits; i++) {
    let HITId = HITIDs[i];
    console.log('API Request for HIT', HITId, 'sent');
    promises.push(api.req('GetAssignmentsForHIT', {HITId: HITId}));
  }

  let results = await Promise.all(promises);

  _.forEach(results, (result) => {
    console.log('A HIT was found\n');
    _.forEach(result.GetAssignmentsForHITResult[0].Assignment, (assignment) => {
      console.log('An Assignment was found\n');
      console.log(assignment.Answer);
    });
  })
}));


module.exports = router;

// api.req('GetAssignmentsForHIT', {HITId: "302U8RURJZCMPKMOFQVFH5OFH4NNVU"}).then(results => {
//   //The HITId passed into this call is one that was returned from GetReviewableHITs
//   //and its NumResults field is 0 which leads me to believe you (Estelle) are right that
//   //there is nothing to review. Otherwise we would be able to call GetAssignment and pass the
//   //AssignmentId to be able to review the turkers work and approver or reject it at which point we could
//   //just dump it in our database and approve it. Since there are no assignments completed there is no
//   //assignment array on the object getting returned by the above call.  I could always be wrong about this
//   //but thats how I believe it's supposed to work based on the horrendous documentation I've read.
//   api.req('GetAssignment', {AssignmentId: "some assignment id"}).then(result => {
//     debugger
//     //this is theoretically where we should be able to write the code to send the dataz to Mongo and then
//     //respond to the client that we can rerender the gallery
//   });
// });
