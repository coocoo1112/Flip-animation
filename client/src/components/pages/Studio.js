import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";
import FlipCanvas from "../modules/FlipCanvas.js";
import ToolNavBar from "../modules/ToolNavBar.js";
import ThumbnailBar from "../modules/ThumbnailBar.js";
import { get, post } from "../../utilities.js"

function addProject() {
  var nameEntered = prompt("enter the name of your project")
  get("/api/whoami").then((user) => {
    const who = user.googleid;
    //console.log(who);
    const body = {user: who};
    get("/api/getNumProjects", body).then((result) => {
      //console.log(result.len);
      const len = result.len;
      const projectBody = {
        name: nameEntered,
        user: who
      };
      post("/api/newProject", projectBody)
    });
  });
}

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
          nextFrame: 0,
          currentFrame: 0,
          frames: [null],
          newFrame: false,
          goPrevFrame: false,
          goNextFrame: false,
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

    saveCanvasImage = (canvas, i) => {
      // console.log(this.state);
      // console.log(state);
      // console.log("current frame is", state.currentFrame);
      this.state.frames[i] = canvas.toDataURL("image/png");
      console.log("image at frame", i, "is", this.state.frames[i]);
    }

    createNewFrame = () => {
      // console.log("current state", this.state);
      this.setState({
        currentFrame: this.state.currentFrame+1,
        newFrame: true,
      })
      console.log(this.state.frames);
      this.state.frames.splice(this.state.currentFrame, 0, null);
    }

    setNewFrameFalse = ()  => {
      // console.log(this.state);
      this.setState({
        newFrame: false,
      })
    }

    previousFrame = () => {
      console.log("hi");
      this.setState({
        currentFrame: this.state.currentFrame-1,
        goPrevFrame: true,
      })
      console.log(this.state.currentFrame);
    }

    setPreviousFrameFalse = () => {
      this.setState({
        goPrevFrame: false,
      })
    }

    nextFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame + 1,
        goNextFrame: true,
        save: true,
      })
    }

    setNextFrameFalse = () => {
      this.setState({
        goNextFrame: false,
      })
    }
  
    render() {
      console.log("current frame", this.state.currentFrame);
      return (
        <>
            <FlipCanvas
              className="flipCanvas"
              currentFrame={this.state.currentFrame}
              frames={this.state.frames}
              color={this.state.color}
              saveFrame={this.saveCanvasImage}
              newFrame = {this.state.newFrame}
              setNewFrameFalse = {this.setNewFrameFalse}
              goPrevFrame = {this.state.goPrevFrame}
              setPreviousFrameFalse = {this.setPreviousFrameFalse}
              goNextFrame = {this.state.goNextFrame}
              setNextFrameFalse = {this.setNextFrameFalse}
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
            <button onClick={() => addProject()}>add project</button>
        </>
      )  
    }
  }

export default Studio;