
class Thought {
  constructor (neg_thought, pos_thought, user_id, processing, HITId, HITTypeId, community, img_id, pos_count = 0, neg_count = 0) {
    this._neg_thought = neg_thought;
    this._pos_thought = pos_thought ;
    this._user_id = user_id;
    this._processing = processing;
    this._HITId = HITId;
    this._HITTypeId = HITTypeId;
    this._community = community;
    this._img_id = img_id;
    this._pos_count = pos_count;
    this._neg_count = neg_count;
  }
};

module.exports = Thought;
