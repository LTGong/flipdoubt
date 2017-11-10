import React, { Component } from "react";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    console.log(this.props.profile);
  }


  render() {
    // console.log(this.match.params.profile.name);

    return <p>Hello</p>;
  }
}

export default User;