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

function changeColor(ctx, e) {
  ctx.strokeStyle = e.target.id
}

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
  //var uri = canvas.toDataURL("image/png")
  //state.frames[state.currentFrame] = (uri);
  //console.log(uri);
  // var buf = __dirname+"flip_logo_small.png";//new Buffer(uri, 'base64');
  // const fs = require("fs");
  // var fileStream = fs.createReadStream("flip_logo_small.png");
  // console.log(fileStream);
  var params = {
    project: state.project,
  }
  post("/api/sendFrame", params).then((frame) => {
    console.log(frame);
  })
  //post("/fileToS3", params).then((result) => console.log(result));

  // if (state.currentFrame == state.frames.length-1) {
  //   console.log("LAST PAGE CAN'T GO TO NEXT");
  // } else {
  //   state.currentFrame++;
  //   const ctx = canvas.getContext("2d");
  //   const image = new Image();
  //   image.src = state.frames[state.currentFrame];
    
  //   image.onload = function () {
  //     ctx.drawImage(image, 0, 0);
  //   }
    
  //}
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
          nextFrame: 0,
          currentFrame: 0,
          frames: [null],
          frameURLs: [null],
          project: "test1",
          newFrame: false,
          changeFrame: false,
          save: false,
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
        nextFrame: this.state.currentFrame + 1,
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
        nextFrame: this.state.currentFrame - 1,
        changeFrame: true,
        save: true,
      })
    }

    nextFrame = () => {
      this.setState({
        nextFrame: this.state.currentFrame + 1,
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

    setNextFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame +1
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
              setNextFrame = {this.setNextFrame}
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
            <button onClick={() => getFrames(this.state)}>test</button>
            <button onClick={() => addProject()}>add project</button>
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