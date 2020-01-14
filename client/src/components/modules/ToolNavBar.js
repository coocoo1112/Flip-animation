import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ToolNavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class ToolNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }


  render() {
    return (
    
    <div class="footer" id="right">
        <span>pencil</span>
        <span>rectangle</span>
        <span>circle</span>
        <span>free draw</span>
    </div>
    );
  }
}

export default ToolNavBar;