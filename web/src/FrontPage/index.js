import React, {Component} from 'react';
import "./frontpage.css";
import Gallery from '../Gallery';
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
        <ThoughtBubble {...this.props} />

        <Gallery getAuthorizationHeader={this.props.getAuthorizationHeader}/>

      </div>;
  }
}

export default Frontpage;
