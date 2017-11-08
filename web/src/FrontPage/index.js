import React, {Component} from 'react';
//import frustratedMonkey from './frustrated-monkey.gif';
import "./frontpage.css";
import './flipcard.css';

// const countStyle = {   color: 'brown', };

class Frontpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      value: ''
    }
    this.foo = this
      .foo
      .bind(this);
    this.transform = this
      .transform
      .bind(this);
    this.checkresults = this
      .checkresults
      .bind(this);
  }

  foo(e) {
    // this.setState(prevState => {   return {clickCount: prevState.clickCount + 1}
    // })
    this.setState({value: e.target.value})
    console.log(this.state.value)
  }

  transform(){
    var thought = this.state.value
    console.log('we transformin "' + thought + '"');

    var turk_data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({thoughtText: thought})
    }

    fetch('/api/mturk/transform', turk_data)
    .then((res) => res.json())
    .then((res) => {
      console.log('In callback after mturk api call');

      let HIT_data = {
        text: thought,
        processing: true,
        HITId: res.HITId,
        HITTypeId: res.HITTypeId
      }

      let db_request = new Request('/api/db/unprotected', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(HIT_data)
      });
      fetch(db_request)
      .then((res) => res.json())
      .then((res) => {
        var mongoIdString = res._id;
        console.log(mongoIdString);
      })
      .catch(err => console.log(err))

    }).catch(err => console.log(err))
  }

  // Poll using a function like this?? I currently just have a button that calls it...
  // Probably just do two things in this function:
  //    (1) check if hit results are in, and if so, update database
  //    (2) check if any of the "processing" values have changed from true to false in the database, and
  //        re-render the gallery if so, based on the values stored in the db...
  checkresults(){
    console.log('CHECKIN IN NOW');
    fetch('/api/mturk/check-hits')
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch(err => console.log(err))
  }


  render() {
    return <div className="FrontPage">
        {/* Move this to search component */}
        <div className="box">
          <div className="field is-grouped">
            <p className="control is-expanded">
              <input value={this.state.value} onChange={this.foo} className="input" type="text" placeholder="Purge your thought." />
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

        {/* Move this to gallery component */}
        <div className="box gallery">
          <h1 className="has-text-centered">Gallery of the Mind</h1>
          <div className="columns">
            <div className="column is-4">
              <div className="card">
                <div className="flip-container" ontouchstart="this.classList.toggle('hover');">
                  <div className="flipper">
                    <div className="front">
                      {/* <!-- front content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                    <div className="back">
                      {/* <!-- back content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/734899052_13956580111.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>

            <div className="column is-4">
              <div className="card">
                <div className="flip-container" ontouchstart="this.classList.toggle('hover');">
                  <div className="flipper">
                    <div className="front">
                      {/* <!-- front content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                    <div className="back">
                      {/* <!-- back content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/734899052_13956580111.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>

            <div className="column is-4">
              <div className="card">
                <div className="flip-container" ontouchstart="this.classList.toggle('hover');">
                  <div className="flipper">
                    <div className="front">
                      {/* <!-- front content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                    <div className="back">
                      {/* <!-- back content --> */}
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img src="http://www.planwallpaper.com/static/images/734899052_13956580111.jpg" alt="" />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
}

export default Frontpage;
