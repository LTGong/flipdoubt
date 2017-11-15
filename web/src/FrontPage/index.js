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
    this.reRenderHack = this
      .reRenderHack
      .bind(this);
  }

  reRenderHack() {
    debugger
    console.log("reRenderHack: this is running");
    this.setState({shouldRerender: true});
    this.forceUpdate();
  }

  render() {
    debugger
    if (this.props.profile) {
      var gallery = <Gallery
        getAuthorizationHeader={this.props.getAuthorizationHeader}
        reRender={this.state.shouldRerender}
        user={this.props.profile.nickname}/>;
    }
    return <div className="FrontPage container">

      <ThoughtBubble reRenderHack={this.reRenderHack} {...this.props}/> 
      
      {gallery}

    </div>
  }
}

export default Frontpage;
