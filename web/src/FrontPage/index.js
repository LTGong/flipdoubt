import React, {Component} from 'react';

//import frustratedMonkey from './frustrated-monkey.gif';
import './frontpage.css';

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

    var fetch_data = {
      method: 'POST',
      body: {thoughtText: thought} //NOT WORKING???!! //JSON.stringify({thoughtText: thought})
    }

    fetch('/api/mturk/transform', fetch_data)
    .then((res) => res.json() )
    .then( (data) => {
      console.log(data)
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <div className="FrontPage">

        {/* Move this to search component */}
        <div className="box">

          <div className="field is-grouped">
            <p className="control is-expanded">
              <input
                value={this.state.value}
                onChange={this.foo}
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

        {/* Move this to gallery component */}
        <div className="box gallery">
          <h1 className="has-text-centered">Gallery of the Mind</h1>
          <div className="columns">

            <div className="column is-4">
            <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg"
                      alt=""/>
                  </figure>
                </div>
                <br/>

                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>

            <div className="column is-4">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg"
                      alt=""/>
                  </figure>
                </div>
                <br/>

                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>

            <div className="column is-4">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src="http://www.planwallpaper.com/static/images/beautiful-scenery-wallpaper.jpg"
                      alt=""/>
                  </figure>
                </div>
                <br/>
                <footer className="card-footer">
                  <a className="card-footer-item">Tweet on Twitter</a>
                  <a className="card-footer-item">Post on Facebook</a>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Frontpage;
