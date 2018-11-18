var _ = require('lodash');
class Thought {
  constructor(neg_thought, pos_thought, user_id, HITs, community, img_id, pos_thought_timestamps = [], neg_thought_timestamps = []) {
    this._neg_thought = neg_thought;
    this._placeholder = pos_thought;
    this._pos_thoughts = [];
    this._user_id = user_id;
    this._HITs = HITs;
    this._HITTypeId = HITs[0].HITTypeId;
    this._community = community;
    this._img_id = img_id;
    this._pos_thought_timestamps = pos_thought_timestamps;
    this._neg_thought_timestamps = neg_thought_timestamps;
  }
};

module.exports = Thought;
