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
          thickness: 1,
          canvas: null,
          currentFrame: 0,
          frames: [null],
          project: "test1",
          newFrame: false,
          switchFrame: false,
          prevFrame: 0,
          play: false,
        };
      this.fs = require("fs");
    }

    changeColor(e) {
      if (e.target.id === "eraser") {
        this.setState({
          color: "white",
          thickness: 30,
        });
      } else {
        this.setState({
          color: e.target.id,
          thickness: 1,
        })
      }
    }

    changeThickness = (newThickness) => {
      this.setState({
        thickness: newThickness,
      })
    }

    saveCanvasImage = (canvas, i) => {
      this.state.frames[i] = canvas.toDataURL("image/png");
    }

    createNewFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame+1,
        newFrame: true,
      })
      this.state.frames.splice(this.state.currentFrame, 0, null);
    }

    setNewFrameFalse = ()  => {
      this.setState({
        newFrame: false,
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

    PlayAnimation = () => {
      // console.log("Play Animation");
      this.setState({
        play: true,
      })
    }

    setPlayAnimationFalse = () => {
      this.setState({
        play: false,
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
              thickness={this.state.thickness}
              saveFrame={this.saveCanvasImage}
              newFrame = {this.state.newFrame}
              setNewFrameFalse = {this.setNewFrameFalse}
              switchFrame = {this.state.switchFrame}
              setSwitchFrameFalse = {this.setSwitchFrameFalse}
              prevFrame = {this.state.prevFrame}
              play = {this.state.play}
              setPlayAnimationFalse = {this.setPlayAnimationFalse}
            />
            <div>
              <button onClick={() => this.goToFrame(this.state.currentFrame-1)}>Previous</button>
              <button onClick={() => this.goToFrame(this.state.currentFrame+1)}>Next</button>
              <button onClick={() => this.createNewFrame()}>New Frame</button>
            </div>
            <div>
              <button onClick={this.PlayAnimation}>Play</button>
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
              changeThickness = {this.changeThickness}
            />
            <button onClick={() => getFrames(this.state)}>test</button>
            <button onClick={() => addProject()}>add project</button>
        </>
      )  
    }
  }

export default Studio;