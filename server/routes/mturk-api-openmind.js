var express = require('express');
var mturk = require('mturk-api');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

var config = {
    access : 'AKIAINJT6YTLRJMBWOWA',
    secret : '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',
    sandbox: true
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

router.get('/check-hits', function(req, res, next) {
  console.log('In check-hits.');
  mturk.createClient(config)
    .then(function(api){
      console.log(api);
      debugger
      api.req('GetReviewableHITs')
      .then(results => {
        console.log('In createClient-GetReviewableHITs callback.');
        console.log(results.GetReviewableHITsResult[0].HIT);
        //My idea here is to get the assignments for a HIT that comes back in the results from
        //GetReviewableHITs and then check the NumResults field on the returned object if that field is
        //greater than 0 then we make calls for all the HITS that are returned
        debugger
        api.req('GetAssignmentsForHIT', {HITId: "302U8RURJZCMPKMOFQVFH5OFH4NNVU"}).then(results => {
          //The HITId passed into this call is one that was returned from GetReviewableHITs
          //and its NumResults field is 0 which leads me to believe you (Estelle) are right that
          //there is nothing to review. Otherwise we would be able to call GetAssignment and pass the
          //AssignmentId to be able to review the turkers work and approver or reject it at which point we could
          //just dump it in our database and approve it. Since there are no assignments completed there is no
          //assignment array on the object getting returned by the above call.  I could always be wrong about this
          //but thats how I believe it's supposed to work based on the horrendous documentation I've read.
          api.req('GetAssignment', {AssignmentId: "some assignment id"}).then(result => {
            debugger
            //this is theoretically where we should be able to write the code to send the dataz to Mongo and then
            //respond to the client that we can rerender the gallery
          });
        });
      })
    })
    .catch(console.error)
});

module.exports = router;

    // //Example operation, with params
    // api.req('SearchHITs', { PageSize: 100 }).then(function(res){
    //    //Do something
    // }).catch(console.error)


    // //MTurk limits the velocity of requests. Normally,
    // //if you exceed their request rate-limit, you will receive a
    // //'503 Service Unavailable' response. As of v2.0, our interface
    // //automatically throttles your requests to 3 per second.
    // for(var i=1; i < 20; i++){
    //   //These requests will be queued and executed at a rate of 3 per second
    //   api.req('SearchHITs', { PageNumber: i }).then(function(res){
    //     //Do something
    //   }).catch(console.error);
    // }


// router.post('/transform', function(req, res, next) {
//   console.log('server: In transform');
//   mturk.createClient(config).then(function(api){
//
//     console.log('server: in createClient');
//     //Import an XML file. You can use one of our examples in the templates folder *
//     fs.readFile(__dirname + '/../templates/HTMLQuestion.xml', 'utf8', function(err, unescapedXML){
//
//       console.log('server: in readFile');
//       if(err){console.error(err);return}
//
//       //HIT options
//       var params = {
//         Title: "Create HIT Example",
//         Description: "An example of how to create a HIT",
//         Question: _.escape(unescapedXML),//IMPORTANT: XML NEEDS TO BE ESCAPED!
//         AssignmentDurationInSeconds: 180, // Allow 3 minutes to answer
//         AutoApprovalDelayInSeconds: 86400 * 1, // 1 day auto approve
//         MaxAssignments: 100, // 100 worker responses
//         LifetimeInSeconds: 86400 * 3, // Expire in 3 days
//         Reward: {CurrencyCode:'USD', Amount:0.50}
//       };
//
//       api.req('CreateHIT', params).then(function(res){
//         console.log('server: after CreateHIT');
//         res.status(201).end()
//       }).catch(console.error);
//     }, (err)=> {
//       console.log(err)
//       res.status(507).send({message: err})
//       })
//   })
// });
