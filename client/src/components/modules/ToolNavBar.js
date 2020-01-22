import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ToolNavBar.css";


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
          id="eraser"
          onClick = {this.props.Colorchanger}
        >Eraser</button>
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