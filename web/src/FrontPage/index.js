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
    if(!this.props.profile === undefined) {
      var gallery = <Gallery getAuthorizationHeader={this.props.getAuthorizationHeader} user={this.props.profile.nickname}/>;
    }
    return <div className="FrontPage container">
      <ThoughtBubble {...this.props} />
      {gallery}
      <Community/>
    </div>
  }
}

export default Frontpage;
