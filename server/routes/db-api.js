var express = require('express');
var router = express.Router();
var Thought = require('../lib/thought.js');
var _ = require('lodash');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

router.post('/create-new-thought', checkJwt, function (req, res, next) {
  console.log('IN CREATE NEW THOUGHT.');
  let img_id = Math.floor(Math.random() * 10) + 1;

  let newThought = new Thought(req.body.text, null, req.body.user_name, req.body.processing, req.body.HITId, req.body.HITTypeId, false, img_id);

  req
    .db
    .collection('thoughts')
    .insertOne(newThought)
    .then(function (result) {
      console.log('In unprotected db callback');
      console.log(result.ops[0]);
      res
        .status(200)
        .send(result.ops[0]);
    }, (error) => {
      console.log("error");
    })
    .catch(function (error) {
      throw(error);
    });
});

router.post('/get-user-quotes', checkJwt, function (req, res, next) {
console.log("In get user quotes");
  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection('thoughts')
    .find({"_user_id": user_id, "_processing": false})
    .toArray(function(err, results) {
      res
      .json(results);
    })
});


router.get('/swap-image', checkJwt, function (req, res, next) {

  console.log(req.body);
  let HITId = req.body._HITId;
  // let user_id = req.body._user_id;
  let old_img_id = req.body._img_id;
  let new_img_id = Math.floor(Math.random() * 10) + 1;

  req.db.collection('thoughts').updateOne(
    {_HITId: HITId},
    {$set: {"_img_id": new_img_id}}
  ).then((result)=> {
    console.log(result)
    res.status(200).send("Swapped img_id " + old_img_id + " for " + new_img_id);
  })
});


router.get('/get-community-quotes', function (req, res, next) {
  // This will come from req.user when we figure out authentication
  req
    .db
    .collection('thoughts')
    .find({"_community": true})
    .toArray(function(err, results) {
      res
      .json(results);
    })
});

router.get('/get-processing-HITs', function(req, res, next) {
  console.log('in db get-processing-HITs');

  let HITIds = [];
  req.db.collection('thoughts').find({_processing: true})
  .toArray(function(err, results){
    _.forEach(results, ( result =>{
      HITIds.push(result._HITId);
    }))
    res.status(200).send(HITIds);
  });
})

router.post('/update-processed-HIT', function(req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function(HIT_update){
    req.db.collection('thoughts').updateOne(
      {_HITId: HIT_update.HITId},
      {$set: {"_processing": false, "_pos_thought" : HIT_update.pos_thought}}
    )
  });
  res.json({message: 'FUCK YEA!'});
});

router.get('/community-thoughts', function(req, res, next) {
  console.log('in db community-thoughts');

  let db_ids = [];
  req.db.collection('thoughts').find({_community: true})
  .toArray(function(err, results){
    _.forEach(results, ( result =>{
      db_ids.push(result._id);
    }))
    res.status(200).send(db_ids);
  });
})


router.post('/update-processed-HIT', function(req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function(HIT_update){
    req.db.collection('thoughts').updateOne(
      {_HITId: HIT_update.HITId},
      {$set: {"_processing": false, "_pos_thought" : HIT_update.pos_thought}}
    )
  });
  res.json({message: 'FUCK YEA!'});
});



router.post('/update-processed-HIT', function(req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function(HIT_update){
    req.db.collection('thoughts').updateOne(
      {_HITId: HIT_update.HITId},
      {$set: {"_processing": false, "_pos_thought" : HIT_update.pos_thought}}
    )
  });
  res.json({message: 'FUCK YEA!'});
});




// checkJwt middleware will enforce valid authorization token
router.get('/protected', checkJwt, function (req, res, next) {
  console.log('In Protected db call');

  console.log(req.user);

  req
    .db
    .collection('thoughts')
    .find()
    .toArray(function (err, results) {
      if (err) {
        next(err);
      }
      console.log('In mongo call.')
      console.log(results);

      res
        .status(200)
        .send('Eureka!');
      // res.json({   db_id: 'Ad ID shall be sent!' });
    });
  // // the auth0 user identifier for connecting users with data
  // console.log('auth0 user id:', req.user.sub);
  //
  // // fetch info about the user (this isn't useful here, just for demo) const
  // userInfoUrl = req.user.aud[1]; const bearer = req.headers.authorization;
  // fetch(userInfoUrl, { 	headers: { 'authorization': bearer }, })   .then(res =>
  // res.json())   .then(userInfoRes => console.log('user info res', userInfoRes))
  //   .catch(e => console.error('error fetching userinfo from auth0'));
});

module.exports = router;
