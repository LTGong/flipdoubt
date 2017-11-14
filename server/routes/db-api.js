var express = require('express');
var router = express.Router();
var Thought = require('../lib/thought.js');
var _ = require('lodash');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

router.post("/create-new-thought", checkJwt, function (req, res, next) {
  console.log("IN CREATE NEW THOUGHT.");
  let img_id = Math.floor(Math.random() * 10) + 1;

  let date_day = Date(Date.now())
    .toString()
    .split(" ")[0];
  let today = Date.now();
  let new_today = new Date(today);
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  let date_info = {
    full_stamp: today,
    // day: date_stuff[0], // Sat, Sun, Mon
    full_date: date_string // 11/11/2017
  };
  let default_pos_thought = " ... Transformation in progress. Check back soon! ...";
  let newThought = new Thought(req.body.text, default_pos_thought, req.body.user_name, req.body.processing, req.body.HITId, req.body.HITTypeId, false, img_id, [], [date_info]);
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
});

router.post('/get-user-quotes', checkJwt, function (req, res, next) {
  console.log("In get user quotes");
  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection('thoughts')
    // .find()
    .find({"_user_id": user_id, "_processing": false})
    .toArray(function (err, results) {
      res.json(results);
    })
});

router.post('/get-user-thought-summary', checkJwt, function (req, res, next) {

  let user_id = req.body.username;
  console.log(user_id);
  req
    .db
    .collection('thoughts')
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
      res.json(results);
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
  // This will come from req.user when we figure out authentication
  req
    .db
    .collection('thoughts')
    .find({_community: true})
    .toArray(function (err, results) {
      res.json(results);
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
    .find({_processing: true, _user_id: user})
    .toArray(function (err, results) {
      _.forEach(results, (result => {
        HITIds.push(result._HITId);
      }))
      res
        .status(200)
        .send(HITIds);
    });
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
    .collection("thoughts")
    .find({_user_id: user, _processing: false})
    .toArray(function (err, results) {
      console.log(results);
      _.forEach(results, result => {

        //pulling out relevant info from the last 7 days
        _.forEach(result._pos_thought_timestamps, timeobj => {
          // Only count the pos thoughts that was recorded with the right timestamp
          if (timeobj === timeobj + '') {
            prior_7_days_counts_pos[prior_7_days_strings.indexOf(timeobj)]["value"] = prior_7_days_counts_pos[prior_7_days_strings.indexOf(timeobj)].value + 1;
          }
        });

        _.forEach(result._neg_thought_timestamps, timeobj => {
          let _full_date = timeobj.full_date;
          if (prior_7_days_strings.indexOf(_full_date) >= 0) {
            prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj.full_date)]["value"] = prior_7_days_counts_neg[prior_7_days_strings.indexOf(timeobj.full_date)].value + 1;
          }
        });

        console.log("Total POSITIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_pos);
        console.log("Total NEGATIVE COUNTS after adding this thought: " + result._HITId);
        console.log(prior_7_days_counts_neg);
      });
      let total = [prior_7_days, prior_7_days_counts_pos, prior_7_days_counts_neg, results];
      res.json(total);
      console.log(total);
    });
});

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');
  let HIT_updates = req.body;
  console.log(HIT_updates);
  _.forEach(HIT_updates, function (HIT_update) {
    req
      .db
      .collection('thoughts')
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
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $set: {
        _community: true
      }
    });

  res.json({message: 'SHared to community'});
})

router.post('/increment_pos_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);

  let today = Date.now();
  let new_today = new Date(today);
  let date_string = new_today.getMonth() + 1 + "/" + new_today.getDate() + "/" + new_today.getFullYear();
  console.log(date_string);

  req
    .db
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $push: {
        _pos_thought_timestamps: date_string
      }
    });

  res.json({message: 'Incremented Positive'});
})

router.post('/increment_neg_thought', function (req, res, next) {
  console.log("req.body._HITId: " + req.body);
  req
    .db
    .collection('thoughts')
    .updateOne({
      _HITId: req.body._HITId
    }, {
      $push: {
        _neg_thought_timestamps: Date.now()
      }
    });

  res.json({message: 'Incremented Negative'});
})

router.post('/update-processed-HIT', function (req, res, next) {
  console.log('in db update-processed-HIT');

  let HIT_updates = req.body;
  _.forEach(HIT_updates, function (HIT_update) {
    req
      .db
      .collection('thoughts')
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
      .collection('thoughts')
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
