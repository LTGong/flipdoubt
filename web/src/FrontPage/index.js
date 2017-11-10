import React, {Component} from 'react';
import "./frontpage.css";
import Gallery from '../Gallery';
import Community from '../Community';
import ThoughtBubble from '../ThoughtBubble';

class Frontpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shouldRerender: false
    }
  }

  render() {
    return <div className="FrontPage container">
      <ThoughtBubble/>

      <Gallery/>

      <Community/>

    </div>;
  }
}

export default Frontpage;
