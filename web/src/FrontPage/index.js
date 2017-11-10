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
      <ThoughtBubble {...this.props} />

      <Gallery getAuthorizationHeader={this.props.getAuthorizationHeader} user={this.props.profile.nickname}/>

      <Community/>

    </div>;
  }
}

export default Frontpage;
