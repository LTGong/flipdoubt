import React, { Component } from 'react';

//import frustratedMonkey from './frustrated-monkey.gif';
import './frontpage.css';

// const countStyle = {
//   color: 'brown',
// };

class Frontpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      value: ''
    }
    this.foo = this.foo.bind(this);
    this.transform = this.transform.bind(this);
  }

  foo(e) {
    // this.setState(prevState => {
    //   return {clickCount: prevState.clickCount + 1}
    // })
    this.setState({
       value: e.target.value
    })
    console.log(this.state.value)
  }

  transform(){
    console.log('we transformin yo');
    fetch('/api/mturk/transform', {
      method: 'POST',
      body: JSON.stringify({thoughtText: this.state.value})
    })
    .then((res) => res.json() )
    .then( (data) => {
      console.log(data)
    })
    .catch(
      err => console.log(err)
    )
  }

  render() {
    return (
      <div className="FrontPage">

      <div className="box">
        <div className="field is-grouped">
          <p className="control is-expanded">
            <input value={this.state.value} onChange={this.foo} className="input" type="text" placeholder="Purge your thought." />
          </p>

          <p className="control">
            <a className="button is-info" onClick={this.transform} >
              Transform
            </a>
          </p>
        </div>
      </div>

      </div>
    );
  }
}

// <div>
//   <img src={frustratedMonkey} alt="animated gif of a monkey shoving a laptop off the table" />
// </div>

// <h1>
//   <span className="icon"><i className="fa fa-home"></i></span>
//   &nbsp;
//   the front page!
// </h1>
//
// <div className="level">
//   <div className="level-left">
//     <div className="level-item">
//       <button className="button" onClick={this.foo}>example button</button>
//     </div>
//     <div className="level-item" style={countStyle}>
//       click count: {this.state.clickCount}
//     </div>
//   </div>
// </div>

export default Frontpage;
