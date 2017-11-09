import React, {Component} from 'react';
// import "./ThoughtBubble.css";

class ThoughtBubble extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.transform = this
      .transform
      .bind(this);
    this.checkresults = this
      .checkresults
      .bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value})
    console.log(this.state.value)
  }

  handleClear (e) {
      this.setState({value: ''})
  }

  transform() {
    var thought = this.state.value;
    this.handleClear();
    console.log('we transformin "' + thought + '"');

    var turk_data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({thoughtText: thought})
    }

    fetch('/api/mturk/transform', turk_data).then((res) => res.json()).then((res) => {
      console.log('In callback after mturk api call');

      let HIT_data = {
        'text': thought,
        'processing': true,
        'HITId': res.HITId,
        'HITTypeId': res.HITTypeId
      }

      let db_request = new Request('/api/db/unprotected', {
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify(HIT_data)
      });
      fetch(db_request).then((res) => res.json()).then((res) => {
        var mongoIdString = res._id;
        console.log(mongoIdString);
      }).catch(err => console.log(err))

    }).catch(err => console.log(err))
  }

  checkresults() {
    console.log('CHECKIN IN NOW');
    fetch('/api/db/get-processing-HITs')
    .then(res => res.json())
    .then(results => {

      let checkin_request = new Request('/api/mturk/check-hits', {
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify({ 'HITIds': results })
      });

      fetch(checkin_request)
      .then((res) => res.json())
      .then((res) => {
        console.log("Results back from checkin_request\n",res);
        let db_updates = new Request('/api/db/update-processed-HIT', {
          'method': 'POST',
          'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          'body': JSON.stringify(res)
        })
        fetch(db_updates)
        .then((res)=> res.json())
        .then((res)=> {
          console.log(res);
        })
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      <div className="box">
        <div className="field is-grouped">
          <p className="control is-expanded">
            <input
              value={this.state.value}
              onChange={this.handleChange}
              className="input"
              type="text"
              placeholder="Purge your thought."/>
          </p>
          <p className="control">
            <a className="button is-info" onClick={this.transform}>
              Transform
            </a>
          </p>
        </div>
      </div>

      <div className="box">
        <p className="control">
          <a className="button is-info" onClick={this.checkresults}>
            Check Results
          </a>
        </p>
      </div>

    </div>
  );
  }
}

export default ThoughtBubble;
