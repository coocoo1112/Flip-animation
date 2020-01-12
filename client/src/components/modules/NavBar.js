import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./NavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }


  render() {
    return (
      <nav className="NavBar-container">
        <img src={require("../../../../assets/flip_logo_small.png")} class="logo"/>
        {/* <div className="NavBar-title u-inlineBlock">flip</div> */}
        <div className="NavBar-linkContainer u-inlineBlock">
          <Link to="/" className="NavBar-link">
            Home
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Profile
          </Link>
        </div>
      </nav>
    );
  }
}

export default NavBar;
