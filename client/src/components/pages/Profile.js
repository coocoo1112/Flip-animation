import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <h1>Profile</h1>
        <h2> This page is for displaying user information.</h2>
      </>
    );
  }
}

export default Profile;
