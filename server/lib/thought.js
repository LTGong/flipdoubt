
class Thought {
  constructor (neg_thought, pos_thought, user_id, processing, HITId, HITTypeId ) {
    this._neg_thought = neg_thought;
    this._pos_thought = pos_thought ;
    this._user_id = user_id;
    this._processing = processing;
    this._HITId = HITId;
    this._HITTypeId = HITTypeId;
  }
};

module.exports = Thought;
