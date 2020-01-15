import React, { Component } from "react";
import { Link } from "@reach/router";

import { get, post } from "../../utilities";
import "./ThumbnailBar.css";

// function addAThumbnail() {
//   var btn = document.createElement("BUTTON");
//     btn.className = "Thumbnail";
//     document.body.appendChild(btn);
// }

class ThumbnailBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numFrames: 0
    };
    // this.frameRefs = [React.createRef()];
    this.containerRef = React.createRef();
    this.container = null;
  }

  componentDidMount() {
    this.container = this.containerRef.current;
    // this.addThumbnail();
    // this.setState({
    //   numFrames: this.state.numFrames 
    // })
  }

  addThumbnail() {
    var btn = document.createElement("BUTTON");
    btn.className = "Thumbnail";
    btn.id = this.state.numFrames +"";
    btn.onclick = this.props.frameChanger;
    // console.log("id", btn.id);
    this.container.appendChild(btn);
    this.setState({
      numFrames: this.state.numFrames + 1
    })
  }

  findCurrentFrame() {
    // this.props.curentFrame
    // console.log()
    // document.getElementById("1").style.border = "solid";
    var allFrames = document.getElementsByClassName("Thumbnail");
    // console.log(allFrames.length);
    var i;
    for (i = 0; i < allFrames.length; i++) {
      allFrames[i].style.border = "none";
    }
    
    var button = document.getElementById(this.props.currentFrame + "");
    button.style.border = "solid";
    // console.log("button id", button.id);
  }

  render() {
    // console.log("prop frames", this.props.numFrames);
    // console.log("prop frames", this.props.numFrames);
    // console.log("state frames", this.state.numFrames);
    if (this.container) {
      if (this.props.numFrames > this.state.numFrames) {
        this.addThumbnail();
      }
      this.findCurrentFrame();
    }
    
    return (
    
    <div className="HorizontalScroller" ref={this.containerRef}>
      {/* <button id="0" className="Thumbnail">test</button> */}
    </div>
    );
  }
}

export default ThumbnailBar;