class Thought {
  constructor(
    neg_thought,
    pos_thought,
    user_id,
    user_loc,
    processing,
    HITId,
    HITTypeId,
    community, //indicates whether a positive thought should be shared to the "Community Inspirations" tab
    img_id,
    pos_thought_timestamps = [],
    neg_thought_timestamps = [],
    forTurk, //bool, indicates whether a thought should be sent to turk (if true), or to FLIP*DOUBT community (if false)
    checkedOut, //bool, indicates whether a given user is already looking at this neg thought on their mobile screen
    flipper, //user_id of FLIP*DOUBT community member who flipped the thought
    flipper_loc, //location of FLIP*DOUBT community member who flipped the thought
    invalid_thought  //bool, used to check if a thought is a default_blank (if true) or real thought (if false) thought on ReframeScreen
  ) {
    this._neg_thought = neg_thought;
    this._pos_thought = pos_thought;
    this._user_id = user_id;
    this._user_loc = user_loc;
    this._processing = processing;
    this._HITId = HITId;
    this._HITTypeId = HITTypeId;
    this._community = community;
    this._img_id = img_id;
    this._pos_thought_timestamps = pos_thought_timestamps;
    this._neg_thought_timestamps = neg_thought_timestamps;
    this._forTurk = forTurk;
    this._checkedOut = checkedOut;
    this._flipper = flipper;
    this._flipper_loc = flipper_loc;
    this._invalid_thought = invalid_thought
  }
};

module.exports = Thought;
