import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ToolNavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */

function handleButtonPress(e) {
    // console.log(clic_id);
  console.log(e.target.id);
}

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
      <div className="CurrentTool">
      </div>
      <div className="CurrentToolContainer">
        <button 
          className="ChangeColor"
          id="red"
          onClick = {this.props.Colorchanger}
        ></button>
        <button 
          className="ChangeColor"
          id="black"
          onClick = {this.props.Colorchanger}
        ></button>
        <button 
          className="ChangeColor"
          id="blue"
          onClick = {this.props.Colorchanger}
        ></button>
        <button 
          className="ChangeColor"
          id="green"
          onClick = {this.props.Colorchanger}
        ></button>
      </div>
      <div className="Tools">
        Text.
      </div>
    </div>
    );
  }
}

export default ToolNavBar;