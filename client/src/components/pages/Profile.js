import React, { Component } from "react";
import { get } from "../../utilities";

import "../../utilities.css";
import "./Studio.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      catHappiness: 0,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get(`/api/user`, { userid: this.props.userId }).then((user) => this.setState({ user: user }));
  }

  render() {
    if (!this.state.user) {
      return <div> Loading! </div>;
    }
    return (
      <>
        <h1>Profile</h1>
        <h1>{this.state.user.name}</h1>
        <h2> This page is for displaying user information.</h2>
      </>
    );
  }
}

export default Profile;
