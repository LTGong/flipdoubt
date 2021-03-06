var express = require('express');
var router = express.Router();
var Thought = require('../lib/thought.js');
var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

router.post("/create-new-thought", checkJwt, function (req, res, next) {
  console.log("IN CREATE NEW THOUGHT.");
  let img_id = Math.floor(Math.random() * 10) + 1;
  console.log("Image Id is: " + img_id);

  let new_today = new Date(Date.now());
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();

  let default_pos_thought = "(... transformation in progress ...)";
  var HITs = req.body.map((item) => ({HITId: item.HITId, processing: true}))
  let newThought = new Thought(
    req.body[0].text,
    default_pos_thought,
    req.body[0].user_name,
    HITs,
    HITs[0].HITTypeId,
    false,
    img_id,
    [],
    [date_string]);
  console.log(newThought);

  req
    .db
    .collection("thoughts")
    .insertOne(newThought)
    .then(function (result) {
      console.log("In unprotected db callback");
      console.log(result.ops[0]);
      res
        .status(200)
        .send(result.ops[0]);
    }, error => {
      console.log("error");
    })
    .catch(function (error) {
      throw error;
    });
  req.db.collection('users')
     .update(
       {"user_id": {$eq: req.body[0].username }},
       {$setOnInsert: {"user_id": req.body[0].user_name }},
       {upsert: true});
});

router.get('/get-thoughts', checkJwt, function(req, res, next) {
  if(req.query.HITIds) {
    const ids = req.query.HITIds.split(",");
    req.db.collection('thoughts')
        .find({_HITs: {$elemMatch: {HITId: { $in: ids } }}})
        .toArray(function(err, results) {
          res.json(results.reverse());
        })
  } else {
    console.log("In /get-thoughts");
    req.db.collection('thoughts')
        .find({_user_id: req.query.user_id, _HITs: { $elemMatch: {"processing": false}}})
        .toArray(function(err, results) {
          let resultsWithAllHitsRespondedTo = results.filter((item) => {
            let numHitsRespondedTo = _.reduce(item._HITs, (sum, hit) => {
              return (hit.processing === false) ? (sum + 1) : sum;
            }, 0);
            return numHitsRespondedTo === 3;
          });
          let resultsReadyForRating;
          if (!req.query.showAll) {
              resultsReadyForRating = resultsWithAllHitsRespondedTo.filter((item) => {
              let numHitsRated = _.reduce(item._HITs, (sum, hit) => {
                return (hit.rating !== null) ? (sum + 1) : sum;
              }, 0);
              return numHitsRated < 3;
            });
          } else {
            resultsReadyForRating = resultsWithAllHitsRespondedTo;
          }
          res.json(resultsReadyForRating.reverse());
        });
  }
});

router.get('/get-ratings', checkJwt, function(req, res, next) {
  req.db.collection('ratings').find().toArray((err, ratings) => {
    res.json(ratings[0]);
  });
});

router.get('/get-user', checkJwt, function(req, res, next) {
  req.db.collection('users')
      .find({"user_id": {$eq: req.query.username}})
      .toArray((err, users) => {
        res.json(users[0])
      });
});

router.post('/set-reason', checkJwt, function(req, res, next) {
  req.db.collection('thoughts')
      .update(
          {_id: ObjectId(req.body.thoughtId), "_HITs.HITId": req.body.hitId},
          {$set: {"_HITs.$.reason": req.body.reason}}).then((result) => {
           res.status(200);
  });
});

router.post('/set-rating', checkJwt, function(req, res, next) {
  console.log("In set rating");
  req.db.collection('thoughts')
      .find({_id: ObjectId(req.body.thoughtId), "_HITs.HITId": req.body.hitId})
      .toArray((error, data) => {
       let thought = data[0];
        req.db.collection('ratings').find({}).toArray((error, results) => {
          for(let i = 0; i < results[0].starRatings.length; i++) {
            if(results[0].starRatings[i].numStars === req.body.rating) {
              for(let j = 0; j < thought._HITs.length; j++) {
                if(thought._HITs[j].HITId === req.body.hitId) {
                  if(thought._HITs[j].rating === null) {
                    var rating = results[0].starRatings[i];
                    rating.count += 1;
                  } else {
                    rating = results[0].starRatings[i];
                    rating.count += 1;
                    var collection = _.filter(results[0].starRatings, (item) => {
                      return item.numStars === thought._HITs[j].rating;
                    });
                    var oldRating = collection[0];
                    oldRating.count -= 1;
                  }
                }
              }
            }
          }
          if(rating) {
            req.db.collection('ratings')
                .update(
                    {"starRatings": {$elemMatch: {numStars: {$eq: req.body.rating}}}},
                    {$set: {"starRatings.$.count": rating.count}}).then((result) => {
            });
          }
          if(oldRating) {
            req.db.collection('ratings').update(
                {"starRatings": {$elemMatch: {numStars: {$eq: oldRating.numStars}}}},
                {$set: {"starRatings.$.count": oldRating.count}}).then((result) => {
                  console.log("Old Rating decremented");
            });
          }
          req.db.collection('thoughts')
              .update(
                  {_id: ObjectId(req.body.thoughtId), "_HITs.HITId": req.body.hitId},
                  {$set: {
                      "_HITs.$.rating": req.body.rating
                    }})
              .then((result) => {
                res.status(200).send({
                  thoughtId: req.body.thoughtId,
                  hitId: req.body.hitId,
                  rating: req.body.rating
                });
              });
        });
  });
});

router.post('/get-user-quotes', checkJwt, function (req, res, next) {
  console.log("In get user quotes");
  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection('thoughts')
    .find({"_user_id": user_id, _HITs: { $elemMatch: {"processing": false}}})
    .toArray(function (err, results) {
      res.json(results.reverse());
    })
});

router.post('/get-user-thought-summary', checkJwt, function (req, res, next) {

  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection('thoughts')
    .find({"_user_id": user_id})
    .toArray(function (err, results) {
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        if (result._neg_thought_timestamps != undefined) {
          result._neg_thought_timestamps_count = result._neg_thought_timestamps.length;
        } else {
          result._neg_thought_timestamps_count = 0;
        }

        if (result._pos_thought_timestamps != undefined) {
          result._pos_thought_timestamps_count = result._pos_thought_timestamps.length;
        } else {
          result._pos_thought_timestamps_count = 0;
        }

      }

      res.json(results.reverse());
      console.log(results);
    })
});

router.post('/swap-image', checkJwt, function (req, res, next) {

  console.log("swap-image:req.body._HITId: " + req.body._HITId);
  let new_img_id = Math.floor(Math.random() * 10) + 1;

  req
    .db
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $set: {
        _img_id: new_img_id
      }
    })
    .then((result) => {
      console.log(result)
      res
        .status(200)
        .send({_img_id: new_img_id});
    })
});

router.get('/get-community-quotes', function (req, res, next) {
  req.db.collection('thoughts')
     .find({_HITs: {$elemMatch: {positive_thought: {$ne: null}}}})
     .toArray((err, results) => {
       res.json(results.reverse())
     })
});

router.post('/get-processing-HITs', function (req, res, next) {
  let user = req.body.username;
  console.log(user);
  console.log('in db get-processing-HITs');
  let HITIds = [];
  req
    .db
    .collection('thoughts')
    .find({_HITs: {$elemMatch: {processing: true}}, _user_id: user})
    .toArray(function (err, results) {
      _.forEach(results, (result => {
        var ids = result._HITs.map((hit) => { return hit.HITId });
        for(var i=0; i < ids.length; i++) {
          HITIds.push(ids[i]);
        }
      }));
      res
        .status(200)
        .send(HITIds);
    });
});


router.post("/get-totals", checkJwt, function (req, res, next) {
  let user = req.body.user;
  console.log("in db get-totals for user: ", user);

  let prior_7_days_counts_pos = [],
    prior_7_days_counts_neg = [],
    prior_7_days_strings = [],
    prior_7_days = [];

  for (i = 6; i > -1; i--) {
    date = new Date();
    date.setDate(date.getDate() - i);
    prior_date = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    prior_7_days.push({label: prior_date});
    prior_7_days_strings.push(prior_date);
    prior_7_days_counts_pos.push({value: 0});
    prior_7_days_counts_neg.push({value: 0});
  }
  console.log(prior_7_days_strings);
  console.log(prior_7_days_counts_pos);
  console.log(prior_7_days_counts_neg);

  let prior_thoughts_per_day = [];

  req
    .db
    .collection("thoughts")
    .find({_user_id: user, _processing: false})
    .toArray(function (err, results) {
      console.log(results);
      _.forEach(results, result => {

        //pulling out relevant info from the last 7 days
        _.forEach(result._pos_thought_timestamps, timeobj => {
          // Only count the pos thoughts recorded with the right timestamp
          if (timeobj === timeobj + '') {
            if (prior_7_days_counts_pos[prior_7_days_strings.indexOf(timeobj)]) {
              prior_7_days_counts_pos[prior_7_days_strings.indexOf(timeobj)]["value"] = prior_7_days_counts_pos[prior_7_days_strings.indexOf(timeobj)].value + 1;
            }
          }
        });

        _.forEach(result._neg_thought_timestamps, timeobj => {
          // Only count the neg thoughts recorded with the right timestamp
          if (timeobj === timeobj + '') {
            if (prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj)]) {
              prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj)]["value"] = prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj)].value + 1;
            }
          }
        });

        console.log("Total POSITIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_pos);
        console.log("Total NEGATIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_neg);
      });
      let total = [prior_7_days, prior_7_days_counts_pos, prior_7_days_counts_neg, results];
      res.json(total);
    });
});

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');
  let HIT_updates = req.body;
  console.log(HIT_updates);
  var promises = [];
  _.forEach(HIT_updates, function (HIT_update) {
    var id = ObjectId(HIT_update.id)
    promises.push(req
      .db
      .collection('thoughts')
      .update(
        {_id: id, "_HITs.HITId": HIT_update.HITId},
        {$set: {
          "_HITs.$.processing": false,
          "_HITs.$.positive_thought": HIT_update.positive_thought,
          "_HITs.$.rating": null
        }}));
  });
  Promise.all(promises).then(results => {
    res.json({message: 'FUCK YEA!'});
  });
});

router.get('/community-thoughts', function (req, res, next) {
  console.log('in db community-thoughts');

  let db_ids = [];
  req
    .db
    .collection('thoughts')
    .find({_community: true})
    .toArray(function (err, results) {
      _.forEach(results, (result => {
        db_ids.push(result._id);
      })); 
      res
        .status(200)
        .send(db_ids);
    });
});

router.post('/share-thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);
  req
    .db
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $set: {
        _community: true
      }
    });

  res.json({message: 'Shared to community'});
});

router.post('/increment_pos_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);

  let today = Date.now();
  let new_today = new Date(today);
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  console.log(date_string);

  req.db
      .collection('thoughts')
      .updateOne({
        _HITId: req.body._HITId
      }, {
        $push: {
          _pos_thought_timestamps: date_string
        }
      });
  console.log('POSITIVE INCREMENT');
  res.json({message: 'Incremented Positive'});
});

router.post('/increment_neg_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);

  let new_today = new Date(Date.now());
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  console.log(date_string);

  req
    .db
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $push: {
        _neg_thought_timestamps: date_string
      }
    });
    console.log('NEGATIVE INCREMENT');
  res.json({message: 'Incremented Negative'});
})

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
  // res.json())   .then(userInfoRes => console.log('user info res',
  // userInfoRes))   .catch(e => console.error('error fetching userinfo from
  // auth0'));
});

module.exports = router;
