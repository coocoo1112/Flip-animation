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
      <nav className="NavBar-container u-flex">
        <img src={require("../../../../assets/flip_logo_small.png")} class="logo"/>
        {/* <div className="NavBar-title u-inlineBlock">flip</div> */}
        <div className="NavBar-linkContainer u-flex">
          <Link to="/studio/" className="NavBar-link">
              Studio
          </Link>
          <Link to="/profile/" className="NavBar-link profile-link">
            <img className="profileIcon" src={require("../../../../assets/profile_icon.png")}/>
          </Link>
        </div>
      </nav>
    );
  }
}

export default NavBar;
