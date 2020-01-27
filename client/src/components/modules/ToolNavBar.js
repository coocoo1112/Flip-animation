import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ToolNavBar.css";


class ToolNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      value: 0,
    };
    this.sliderRef = React.createRef();
    this.slider = null;
  }

  componentDidMount() {
    // console.log("hi");
    this.slider = this.sliderRef.current;
    console.log(this.slider);
    console.log(this.slider.value);
    // this.value = this.slider.value;
    this.setState({
      value: this.slider.value,
    })
    this.slider.value = 1;
    // output.innerHTML = sliderValue
    // this.props.thickness = this.slider.vlaue;
  }

  sliderChange = () => {
    this.setState({
      value: this.slider.value,
    })
    // this.props.thickness = this.slider.value;
    this.props.changeThickness(this.slider.value);
  }

  render() {
    return (
    
    <div class="footer" id="right">
      <div className="CurrentTool">
      </div>
      <div className="CurrentToolContainer">
        <div>
          <button>Pencil</button>
          <button
            id="eraser"
            onClick = {this.props.Colorchanger}
          >Eraser</button>
        </div>
        <div>
          <input type="range" min="1" max="100" class="slider" id="myRange" ref={this.sliderRef} onChange={this.sliderChange}/>
          { this.slider ? (
            <div>Slider Value: {this.slider.value}</div>
          ) : (
            <div>Slider Value: {this.state.value}</div>
          )}
          
        </div>
        <div>
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
      </div>
      <div className="Tools">
        Text.
      </div>
    </div>
    );
  }
}

export default ToolNavBar;