import React, { Component } from "react";
import Thumbnail from "./Thumbnail.js"

import "./ThumbnailBar.css";

class ThumbnailBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let thumbnails = this.props.frames.map((frameObj, i) => (
      <Thumbnail
        key = {i}
        frame = {frameObj}
        currentFrame = {(i == this.props.currentFrame)}
        FrameChanger = {() => this.props.FrameChanger(i)}
        id = {i}
      />
    ))
    
    return (
      <div className="HorizontalScroller" ref={this.containerRef}>
        {thumbnails}
      </div>
    );
  }
}

export default ThumbnailBar;