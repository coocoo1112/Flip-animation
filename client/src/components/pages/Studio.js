import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";
import FlipCanvas from "../modules/FlipCanvas.js";
import ToolNavBar from "../modules/ToolNavBar.js";
import ThumbnailBar from "../modules/ThumbnailBar.js";

// function changeColor(state, e) {
  
//   // state.color = e.target.id
  
// }

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// function newFrame(state, canvas) {
//   // state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));

//   state.frames.splice(state.currentFrame+1, 0, null);
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = "White";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   state.currentFrame++;
// }

function nextFrame(state, canvas, ctx) {
  state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));

  if (state.currentFrame == state.frames.length-1) {
    console.log("LAST PAGE CAN'T GO TO NEXT");
  } else {
    state.currentFrame++;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = state.frames[state.currentFrame];
    
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
    }
    
  }
}

// function previousFrame(state, canvas, ctx) {
//   // state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));
//   if (state.currentFrame == 0) {
//     console.log("FIRST PAGE CAN'T GO TO PREVIOUS");
//   } else {
//     state.currentFrame--;
//     const ctx = canvas.getContext("2d");
//     const image = new Image();
//     image.src = state.frames[state.currentFrame];
    
//     // console.log(state.currentFrame);
//     image.onload = function () {
//       ctx.drawImage(image, 0, 0);
//     }
    
//   }
// }

function toFrame(state, canvas, index) {
  // state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));
  var targetFrame = index;
  console.log("change to frame", targetFrame);
  state.currentFrame = targetFrame;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = state.frames[state.currentFrame];
  
  // console.log(state.currentFrame);
  image.onload = function () {
    ctx.drawImage(image, 0, 0);
  }
}

// function saveCanvasImage(canvas, currentFrame) {
//   this.frames[state.currentFrame] = canvas.toDataURL("image/png");
// }


class Studio extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          mouse_coord: {
           previous_x: null,
           previous_y: null,
          },
          mouseDown: false,
          color: "000000",
          canvas: null,
          currentFrame: 0,
          frames: [null],
          newFrame: false,
          changeFrame: false,
          save: false,
        };
        // this.canvasRef = React.createRef();
        // this.canvas = null;
        // this.ctx = null;
    }

    updateStateFromCanvas(e) {
      console.log(e);
      // this.setState({

      // })
    }

    changeColor(e) {
      this.setState({
        color: e.target.id,
      })
      // console.log("current color", this.state.color);
    }

    saveCanvasImage = (canvas) => {
      // console.log(this.state);
      // console.log(state);
      // console.log("current frame is", state.currentFrame);
      this.state.frames[this.state.currentFrame] = canvas.toDataURL("image/png");
    }

    createNewFrame = () => {
      // console.log("current state", this.state);
      this.setState({
        newFrame: true,
        currentFrame: this.state.currentFrame + 1,
        save: true,
      })
    }

    setNewFrameFalse = ()  => {
      // console.log(this.state);
      this.setState({
        newFrame: false,
        save: false,
      })
    }

    previousFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame - 1,
        changeFrame: true,
        save: true,
      })
    }

    nextFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame + 1,
        changeFrame: true,
        save: true,
      })
    }

    setChangeFrameFalse = () => {
      this.setState({
        changeFrame: false,
        save: false,
      })
    }
  
    render() {
      return (
        <>
            <FlipCanvas
              className="flipCanvas"
              currentFrame={this.state.currentFrame}
              frames={this.state.frames}
              color={this.state.color}
              saveFrame={(canvas) => this.saveCanvasImage(canvas, this.state)}
              newFrame = {this.state.newFrame}
              setNewFrameFalse = {this.setNewFrameFalse}
              changeFrame = {this.state.changeFrame}
              setChangeFrameFalse = {this.setChangeFrameFalse}
              save = {this.state.save}
            />
            <div>
              <button onClick={this.previousFrame}>Previous</button>
              <button onClick={this.nextFrame}>Next</button>
              <button onClick={() => this.createNewFrame()}>New Frame</button>
              {/* <button onClick={(e, param) => test(e, param)}>Test</button> */}
            </div>
            <ThumbnailBar 
              className="Thumbnails"
              numFrames={this.state.frames.length}
              currentFrame = {this.state.currentFrame}
              FrameChanger = {(index) => toFrame(this.state, this.canvas, index)}
              frames = {this.state.frames}
            />
            <ToolNavBar
              Colorchanger = {(e) => this.changeColor(e)}
            />
        </>
      )
      
    }

    
  }
  

// class Animation extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { angle: 0 };
//       this.updateAnimationState = this.updateAnimationState.bind(this);
//     }
  
//     componentDidMount() {
//       this.rAF = requestAnimationFrame(this.updateAnimationState);
//     }
  
//     updateAnimationState() {
//       this.setState(prevState => ({ angle: prevState.angle + 1 }));
//       this.rAF = requestAnimationFrame(this.updateAnimationState);
//     }
  
//     componentWillUnmount() {
//       cancelAnimationFrame(this.rAF);
//     }
  
//     render() {
//       return <Studio/>;
//     }
// }

export default Studio;