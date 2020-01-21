import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";
import FlipCanvas from "../modules/FlipCanvas.js";
import ToolNavBar from "../modules/ToolNavBar.js";
import ThumbnailBar from "../modules/ThumbnailBar.js";
import { get, post } from "../../utilities.js";



// function addFrame() {
//   var AWS = require('aws-sdk');
//   // Set the region 
//   AWS.config.update({region: 'us-east-2'});

//   // Create S3 service object
//   s3 = new AWS.S3({apiVersion: '2006-03-01'});

//   // call S3 to retrieve upload file to specified bucket
//   var uploadParams = {Bucket: 'wholesome-heavies', Key: '', Body: ''};
//   var file = "./flip_logo_small.png";

//   // Configure the file stream and obtain the upload parameters
//   var fs = require('fs');
//   var fileStream = fs.createReadStream(file);
//   fileStream.on('error', function(err) {
//     console.log('File Error', err);
//   });
//   uploadParams.Body = fileStream;
//   var path = require('path');
//   uploadParams.Key = path.basename(file);

//   // call S3 to retrieve upload file to specified bucket
//   s3.upload (uploadParams, function (err, data) {
//     if (err) {
//       console.log("Error", err);
//     } if (data) {
//       console.log("Upload Success", data.Location);
//     }
//   });
// }
// when adding frames each frame will be linked to a project and user
//in mongoose from which we can get the filename of the file in S3
function addProject() {
  var nameEntered = prompt("enter the name of your project");
  get('/api/validateProjectName', { name: nameEntered}).then((out) => {
    if (out) {
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
    else {
      console.log("name taken");
    }
  })
    
}

function getFrames(state) {
  get("/api/getFrames", { project: state.project}).then((frames) => console.log(frames));
}

function getProjects() {
  get("/api/getProjects").then((projects) => console.log(projects))
}

function testNameCheck(inp) {
  //console.log("test");
  const body = { name: inp };
  //console.log(body);
  get("/api/validateProjectName", body).then((output) => {
    console.log(output);
    return output
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
          frameURLs: [null],
          project: "test1",
          newFrame: false,
          goPrevFrame: false,
          goNextFrame: false,
          switchFrame: false,
          prevFrame: 0,
        };
      this.fs = require("fs");
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
      // console.log("image at frame", i, "is", this.state.frames[i]);
    }

    createNewFrame = () => {
      // console.log("current state", this.state);
      this.setState({
        currentFrame: this.state.currentFrame+1,
        newFrame: true,
      })
      // console.log(this.state.frames);
      this.state.frames.splice(this.state.currentFrame, 0, null);
    }

    setNewFrameFalse = ()  => {
      // console.log(this.state);
      this.setState({
        newFrame: false,
      })
    }

    previousFrame = () => {
      // console.log("hi");
      this.setState({
        currentFrame: this.state.currentFrame-1,
        goPrevFrame: true,
      })
      // console.log(this.state.currentFrame);
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

    goToFrame = (frameNumber) => {
      console.log(frameNumber);
      this.setState({
        prevFrame: this.state.currentFrame,
        currentFrame: frameNumber,
        switchFrame: true,
      })
    }

    setSwitchFrameFalse = () => {
      this.setState({
        switchFrame: false,
      })
    }
  
    render() {
      // console.log("current frame", this.state.currentFrame);
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
              switchFrame = {this.state.switchFrame}
              setSwitchFrameFalse = {this.setSwitchFrameFalse}
              prevFrame = {this.state.prevFrame}
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
              goToFrame = {this.goToFrame}
              frames = {this.state.frames}
            />
            <ToolNavBar
              Colorchanger = {(e) => this.changeColor(e)}
            />
            <button onClick={() => getFrames(this.state)}>test</button>
            <button onClick={() => addProject()}>add project</button>
        </>
      )  
    }
  }

export default Studio;