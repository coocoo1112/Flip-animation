import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";

class Studio extends Component {
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
        <h1>STUDIO</h1>
        <h2> This page is for creating flipbooks.</h2>
      </>
    );
  }
}

export default Studio;
