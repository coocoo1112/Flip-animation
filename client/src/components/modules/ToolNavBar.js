import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ToolNavBar.css";


class ToolNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      value: 10,
    };
    this.sliderRef = React.createRef();
    this.slider = null;
    this.playbackRef = React.createRef();
    this.playback = null;
    this.viewPrevRef = React.createRef();
    this.viewPrev = null;
  }

  componentDidMount() {
    // console.log("hi");
    this.slider = this.sliderRef.current;
    this.playback = this.playbackRef.current;
    this.viewPrev = this.viewPrevRef.current;
    this.viewPrev.checked = true;
    console.log(this.slider);
    console.log(this.slider.value);
    // this.value = this.slider.value;
    this.setState({
      value: this.slider.value,
    })
    this.slider.value = 15;
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

  playbackChange = () => {
    console.log("change to", -1*this.playback.value);
    this.props.changePlaybackSpeed(this.playback.value);
  }

  ColorButton(color) {
    return(
      <>
        <button
          className="ChangeColor"
          id = {color}
          style = {{backgroundColor: "#"+color}}
          onClick={this.props.Colorchanger}
        />
      </>
    )
  }

  render() {

    return (
    
    <div class="ToolContainer">
      <div className="CurrentToolTitle">
      </div>
      <div className="CurrentToolContainer">
        <div>
          <button>Pencil</button>
          <button
            id="eraser"
            onClick = {this.props.Colorchanger}
          >Eraser</button>
        </div>
        <div className="LineWidthContainer">
          <input type="range" min="1" max="100" id="myRange" ref={this.sliderRef} onChange={this.sliderChange}/>
          { this.slider ? (
            <div>Line Width: {this.slider.value}</div>
          ) : (
            <div>Line Width: {this.state.value}</div>
          )}
          
        </div>
        <div className = "buttonColorContainer">
          <div>
            {this.ColorButton("ED3333")}
            {this.ColorButton("ED7633")}
            {this.ColorButton("EDB933")}
            {this.ColorButton("85ED33")}
            {this.ColorButton("33AAED")}
            {this.ColorButton("ED33DA")}
          </div>
          <div>
            {this.ColorButton("C73232")}
            {this.ColorButton("B26438")}
            {this.ColorButton("BF9831")}
            {this.ColorButton("68B72B")}
            {this.ColorButton("257EB0")}
            {this.ColorButton("CB22BA")}
          </div>
          <div>
            {this.ColorButton("A52323")}
            {this.ColorButton("8F502C")}
            {this.ColorButton("927018")}
            {this.ColorButton("4B881B")}
            {this.ColorButton("145F89")}
            {this.ColorButton("99168C")}
          </div>
          <div>
            {this.ColorButton("7E1212")}
            {this.ColorButton("6D3616")}
            {this.ColorButton("73570F")}
            {this.ColorButton("386F0D")}
            {this.ColorButton("074263")}
            {this.ColorButton("710866")}
          </div>
          <div>
            {this.ColorButton("000000")}
            {this.ColorButton("353737")}
            {this.ColorButton("5C5E5A")}
            {this.ColorButton("7E7D7B")}
            {this.ColorButton("B9B6B5")}
            {this.ColorButton("FFFFFF")}
          </div>
        </div>
        <div>PlayBack Speed: {1000/this.props.playbackSpeed*-1} fps</div>
        <input type="range" id="playbackSpeed" max="-100" min="-2000" step="200" ref={this.playbackRef} onChange={this.playbackChange}/>
        <div className = "u-flex">
          view previous frame: 
          <label class="switch">
            <input type="checkbox " ref={this.viewPrevRef} onChange={() => {
              this.props.changeViewPreviousFrame(this.viewPrev.checked);
            }}/>
            <span class="slider round viewPrevFrameSwitch"></span>
          </label>
        </div>
      </div>
      <div className="ToolBar">
      </div>
    </div>
    );
  }
}

export default ToolNavBar;