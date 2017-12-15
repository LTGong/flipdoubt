var express = require('express');
var router = express.Router();
var Thought = require('../lib/thought.js');
var _ = require('lodash');
var ObjectId = require("mongodb").ObjectID;

const asyncMiddleware = require('../utils/asyncMiddleware');
const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');


router.post("/create-new-thought", function (req, res, next) {  //removed checkJwt
  //console.log("IN CREATE NEW THOUGHT.");
  let img_id = Math.floor(Math.random() * 10) + 1;

  // let date_day = Date(Date.now())
  //   .toString()
  //   .split(" ")[0];

  let new_today = new Date(Date.now());
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  // let date_info = {
  //   full_stamp: today,
  //   // day: date_stuff[0], // Sat, Sun, Mon
  //   full_date: date_string // 11/11/2017
  // };
  let default_pos_thought = "(... transformation in progress ...)";
  let newThought = new Thought(
    req.body.text,
    default_pos_thought,
    req.body.user_name,
    req.body.user_loc,
    req.body.processing,
    req.body.HITId,
    req.body.HITTypeId,
    false,
    img_id,
    [],
    [date_string],
    req.body.forTurkBool,
    false,
    "anonymousFlipper",
    "somewhere",
    false  //invalid_thought
  );
  //console.log(newThought);

  req
    .db
    .collection("thoughts_web")
    .insertOne(newThought)
    .then(function (result) {
      //console.log(result.ops[0]);
      res
        .status(200)
        .send(result.ops[0]);
    }, error => {
      console.log("error");
    })
    .catch(function (error) {
      throw error;
    });
});

router.post('/get-user-quotes', function (req, res, next) {
  console.log("In get user quotes");
  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection("thoughts_web")
    .find({"_user_id": user_id, "_processing": false})
    .toArray(function (err, results) {
      res.json(results.reverse());
    })
});


router.post('/get-mIDs-for-HITIds', asyncMiddleware(async function(req, res, next) {
  console.log("getting mIDs for HITIds");
  let user_id = req.body.username;
  let hits = req.body.HITIds;
  let promises = [];
  let i = 0;
  for (i; i<hits.length; i++) {
    promises.push(
      req.db.collection("thoughts_web")
        .findOne({"_user_id": user_id, "_forTurk": true ,"_HITId": hits[i]})
    )
  }
  let results = await Promise.all(promises);
  let mIds = [];
  _.forEach(results, (result) =>{
    mIds.push(result._id);
  })
  //console.log(mIds);
  res.json({mongoIds : mIds});
}))

//TODO: get this working with teh JWT's
router.post('/get-user-thought-summary', function (req, res, next) {
  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection("thoughts_web")
    // .find()
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

router.post('/swap-image', function (req, res, next) {

  let new_img_id = Math.floor(Math.random() * 14) + 1;

  req
    .db
    .collection("thoughts_web")
    .updateOne({_id: ObjectId(req.body._id)}, {$set: {_img_id: new_img_id}})
    .then((result) => {
      res
        .status(200)
        .send({_img_id: new_img_id});
    })
});

router.get('/get-community-quotes', function (req, res, next) {
  // This will come from req.user when we figure out authentication
  req
    .db
    .collection("thoughts_web")
    .find({_community: true})
    .toArray(function (err, results) {
      res.json(results);
    })
});

//copied this func from stackoverflow
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

router.post("/get-thoughts-to-reframe", asyncMiddleware(async function(req, res, next) {
  // This will come from req.user when we figure out authentication
  console.log("get-thoughts-to-reframe");
  console.log(req.body.username);
  var user = req.body.username;
  var default_blank = {
    _neg_thought : "Woohoo! The world is at peace. Please check back later.",
    _invalid_thought: true
  }

  req.db
    .collection("thoughts_web")
    .find({ _forTurk: false, _processing: true, _checkedOut: false })
    .toArray(function(err, results) {
      console.log('results');
      var possibleThoughtsToReframe = [];
      _.forEach(results, (result => {
        if (user == result._user_id){console.log("I don't want to see my own negativity.");}
        else {possibleThoughtsToReframe.push(result);}
      }));

      let i = 0;
      let num_possible = possibleThoughtsToReframe.length;
      let num_remaining =  num_possible - 3;

      // Removed the checkedOut logic
      if (num_remaining > -1){
        let idxs = [];
        for (i=0; i<num_possible; i++) {idxs.push(i)}
        let rand_idxs = shuffle(idxs);
        let threeThoughts = [];
        for (i=0;i<3;i++) {threeThoughts.push(possibleThoughtsToReframe[rand_idxs[i]])}
        //console.log(threeThoughts)
        res.json(threeThoughts);
      } else {
        for (i=0; i < -num_remaining ; i++){possibleThoughtsToReframe.push(default_blank)}
        //console.log(possibleThoughtsToReframe)
        res.json(possibleThoughtsToReframe);
      }

      //// The if-else that has the checkedOut logic
      // if (num_remaining > -1){
      //   let idxs = [];
      //   for (i=0; i<num_possible; i++) {idxs.push(i)}
      //   let rand_idxs = shuffle(idxs);
      //   let threeThoughts = [];
      //   for (i=0;i<3;i++) {threeThoughts.push(possibleThoughtsToReframe[rand_idxs[i]])}

      //   var promises = [];
      //   _.forEach(threeThoughts, function (thought) {
      //     promises.push(req.db.collection("thoughts_web")
      //       .updateOne({_id: thought._id}, {$set: {"_checkedOut": true}}));
      //   });
      //   Promise.all(promises).then(results => {
      //     res.json(threeThoughts);
      //   });
      // } else {
      //   var promises = [];
      //   _.forEach(possibleThoughtsToReframe, function (thought) {
      //     promises.push(req.db.collection("thoughts_web")
      //       .updateOne({_id: thought._id}, {$set: {"_checkedOut": true}}));
      //   });
      //   Promise.all(promises).then(results => {
      //     for (i=0; i < -num_remaining ; i++){possibleThoughtsToReframe.push(default_blank)}
      //     res.json(possibleThoughtsToReframe);
      //   });
      // }
    });
}));

router.post('/get-processing-HITs', function (req, res, next) {
  let user = req.body.username;
  console.log('in db get-processing-HITs');
  let HITIds = [];
  req
    .db
    .collection("thoughts_web")
    .find({_processing: true, _user_id: user, _forTurk: true})
    .toArray(function (err, results) {
      _.forEach(results, (result => {
        HITIds.push(result._HITId);
      }))
      res.status(200).send(HITIds);
    });
})

router.post('/get-processed', function (req, res, next) {
  var user = req.body.username;
  console.log('Getting MongoIds of negative thoughts that have been successfully processed for user: ', user);

  req.db.collection("users_web").findOne({ '_user': user }).then(result => {
    // console.log('checked findOne in get-Processed');
    // console.log('result', result);
    if (result){
      console.log(user," exists in users_returned_thoughts collection")
      let ids = result._ids;
      let num_ids = ids.length;
      if (num_ids > 0) {
        console.log(num_ids, ' thoughts are available for push notifications.');
        req.db.collection("users_web")
          .updateOne({_user: user}, {_user: user, _ids: []})
          .then ( results => {
            console.log('MongoIds available for push notifications:');
            console.log(ids);
            res.json({mongoIds : ids});
            }
          )
      } else {
        console.log('No thoughts are available for push notifications');
        res.json({mongoIds : null});
      }
    } else {
      console.log(user," DOES NOT exist in users_returned_thoughts collection")
      res.json({mongoIds : null}); //({message : 'NO USER'});
      }
    })
})

router.post('/add-processed', function (req, res, next){

  let user = req.body.username;
  let id = req.body.mongoId;
  console.log('in add-processed');
  //console.log(user, id);

  req.db.collection("users_web").findOne({_user: user}).then(res => {
    console.log('checked findOne');
    if (res){
      console.log('THERE\'s a USER!');
      req.db.collection("users_web")
        .updateOne({_user: user}, {$push: {_ids: id}})
    } else {
        console.log('There is no USER.');
        if (user === null || user === '') {
          console.log('NULL USER IN ADD-PROCESSED: PROBLEM?!');
        } else {
          req.db.collection("users_web")
            .insertOne( {_user: user, _ids : [ id ] } )
        }
      }
    })
})


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
    .collection("thoughts_web")
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
          // let _full_date = timeobj.full_date;
          // if (prior_7_days_strings.indexOf(_full_date) >= 0) {
          //   prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj.full_date)]["value"] = prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj.full_date)].value + 1;
          // }
        });

        console.log("Total POSITIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_pos);
        console.log("Total NEGATIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_neg);
      });
      let total = [prior_7_days, prior_7_days_counts_pos, prior_7_days_counts_neg, results];
      res.json(total);
      // console.log(total);
    });
});

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');
  let HIT_updates = req.body;
  console.log(HIT_updates);
  var promises = [];
  _.forEach(HIT_updates, function (HIT_update) {
    promises.push(req
      .db
      .collection("thoughts_web")
      .updateOne({
        _HITId: HIT_update.HITId
      }, {
        $set: {
          "_processing": false,
          "_pos_thought": HIT_update.pos_thought
        }
      }));
  });
  Promise.all(promises).then(results => {
    res.json({message: 'HITs updated in DB.'});
  });
});

router.post("/update-reframed-thought", function(req, res, next) {
  console.log("In db: Updating reframed thought");
  //console.log(req.body.neg_mId, typeof(req.body.neg_mId));

  req.db
    .collection("thoughts_web")
    .updateOne({_id: ObjectId(req.body.neg_mId)},
      {$set: {
        _processing: false,
        _pos_thought: req.body.pos_thought,
        _flipper : req.body.flipper,
        _flipper_loc: req.body.flipper_loc
      }}
    )
    .then( result => { res.send('SUCCESS');}
    )

});

router.post("/check-thought-in", function(req, res, next) {
  //console.log("in db check-thought-in");
  //console.log("Checking in thought with mongoId: ", req.body.mongoId)

  req.db
    .collection("thoughts_web")
    .updateOne({_id: ObjectId(req.body.mongoId)},
      {$set: {_checkedOut: false}}
    )
    .then( result => { res.send('SUCCESS');}
    )

});

router.get('/community-thoughts', function (req, res, next) {
  console.log('in db community-thoughts');

  let db_ids = [];
  req
    .db
    .collection("thoughts_web")
    .find({_community: true})
    .toArray(function (err, results) {
      _.forEach(results, (result => {
        db_ids.push(result._id);
      }))
      res
        .status(200)
        .send(db_ids);
    });
})

router.post('/share-thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);
  req
    .db
    .collection("thoughts_web")
    .updateOne({
      _id: ObjectId(req.body._id)
    }, {
      $set: {
        _community: true
      }
    });

  res.json({message: 'Shared to community'});
})

router.post('/increment_pos_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);

  let today = Date.now();
  let new_today = new Date(today);
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  console.log(date_string);

  req
    .db
    .collection("thoughts_web")
    .updateOne({
      _id: ObjectId(req.body._id)
    }, {
      $push: {
        _pos_thought_timestamps: date_string
      }
    });
  console.log('POSITIVE INCREMENT');
  res.json({message: 'Incremented Positive'});
})

router.post('/increment_neg_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);

  let new_today = new Date(Date.now());
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  console.log(date_string);

  req
    .db
    .collection("thoughts_web")
    .updateOne({
      _id: ObjectId(req.body._id)
    }, {
      $push: {
        _neg_thought_timestamps: date_string
      }
    });
    console.log('NEGATIVE INCREMENT');
  res.json({message: 'Incremented Negative'});
})

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function (HIT_update) {
    req
      .db
      .collection("thoughts_web")
      .updateOne({
        _HITId: HIT_update.HITId
      }, {
        $set: {
          "_processing": false,
          "_pos_thought": HIT_update.pos_thought
        }
      })
  });
  res.json({message: 'FUCK YEA!'});
});

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function (HIT_update) {
    req
      .db
      .collection("thoughts_web")
      .updateOne({
        _HITId: HIT_update.HITId
      }, {
        $set: {
          "_processing": false,
          "_pos_thought": HIT_update.pos_thought
        }
      })
  });
  res.json({message: 'FUCK YEA!'});
});

// checkJwt middleware will enforce valid authorization token
router.get('/protected', checkJwt, function (req, res, next) {
  console.log('In Protected db call');

  console.log(req.user);

  req
    .db
    .collection("thoughts_web")
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
