import React, {Component} from 'react';
import "./ThoughtBubble.css";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); // ES5 with npm
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
    if (this.props.profile){
      var thought = this.state.value;
      var the_headers = Object.assign({'Accept': 'application/json','Content-Type': 'application/json'}, this.props.getAuthorizationHeader());
      this.handleClear();
      console.log('we transformin "' + thought + '"');

      let turk_request = new Request('/api/mturk/transform', {
        method: 'POST',
        body: JSON.stringify({thoughtText: thought}),
        headers: the_headers
      });

      fetch(turk_request).then((res) => res.json()).then((res) => {
        console.log('In callback after mturk api call');

        let HIT_data = {
          'text': thought,
          'user_name' : this.props.profile.nickname,
          'processing': true,
          'HITId': res.HITId,
          'HITTypeId': res.HITTypeId
        }

        let db_request = new Request('/api/db/create-new-thought', {
          method: 'POST',
          body: JSON.stringify(HIT_data),
          headers: the_headers
        });

        fetch(db_request).then((res) => res.json()).then((res) => {
          let mongoIdString = res._id;
          console.log(mongoIdString);
        }).catch(err => console.log(err))

      }).catch(err => console.log(err))
    }
    else{
      console.log("No user profile (not logged in.)")
    }
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

  bubbleClicked () {

  }


  render() {
    return <div>
        {/* <div>
          <button>Have a negative thought?</button>

          <input type="email" value="" name="EMAIL" className="email-field" id="email-field" placeholder="Tell me more" />

          <input type="submit" value="Subscribe" name="subscribe" id="subscribe-button" className="" />

        </div> */}
        <div className="box cloud">
          <div className="field is-grouped">
            <p className="control is-expanded">
              <input value={this.state.value} onChange={this.handleChange} className="input" type="text" placeholder="Purge your thought." />
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
      </div>;
  }
}

export default ThoughtBubble;
