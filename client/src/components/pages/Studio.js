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

// function testNameCheck(inp) {
//   //console.log("test");
//   const body = { name: inp };
//   //console.log(body);
//   get("/api/validateProjectName", body).then((output) => {
//     console.log(output);
//     return output
//   });
// }

function showFrame(state, canvas) {
  var i = prompt("enter frame number");
  const body = {
    project: state.project,
    idSend: state.frameIds[i]
  };
  console.log(body.id)
  get("/api/getFrame", body).then((frame) => {
    console.log("hi");
    var d = frame;
    var w = window.open('about:blank','image from canvas');
    w.document.write("<img src='"+d+"' alt='from canvas'/>");
  });
}

function changeProject(name) {
  get("/api/getFrames").then((output) => {
    this.state.frames = output;
  })
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
          currentFrame: 0,
          frames: [null],
          frameIds: [null],
          project: "test1",
          newFrame: false,
          switchFrame: false,
          prevFrame: 0,
          play: false,
          projects: [null],
        };
      this.fs = require("fs");
    }

    changeColor(e) {
      this.setState({
        color: e.target.id,
      })
    }

    saveCanvasImage = (canvas, i) => {
      var canvasStream = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      //window.location.href=canvasStream;
      console.log("test", this.state.currentFrame, this.state.frameIds)
      const body = {
        project: this.state.project,
        stream: canvasStream,
        id: this.state.frameIds[this.state.currentFrame - 1],
      };
      //console.log("2");
      post("/api/sendFrame", body).then((id) => {
        console.log("hi", id)
        this.state.frameIds[this.state.currentFrame - 1] = id;
        console.log("after change: ", this.state.frameIds)
        console.log("id: ", id);
        
        //this.state.frames[i] = this.setFrame(id, i, canvasStream)
        // this.state.frames[i] = canvasStream;
        // console.log(this.state.frames)
      });
      //console.log("test2", canvasStream);
      this.state.frames[i] = canvasStream;
      console.log(this.state.frames)
    }

    setFrame = (id, i, stream) => {
      const body = {
        project: this.state.project,
        idSend: id,
      };
      get("/api/getFrame", body).then((frame) => {
        console.log("idk test: ", frame.data === stream);
        //console.log(frame.data);
        //console.log(stream);
        //console.log("test1 ", frame.data)
        return frame.data;
      });
    }

    createNewFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame+1,
        newFrame: true,
      })
      this.state.frames.splice(this.state.currentFrame, 0, null);
      this.state.frameIds.splice(this.state.currentFrame, 0, null);

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
              frameIds={this.state.frameIds}
              currentFrame={this.state.currentFrame}
              frames={this.state.frames}
              color={this.state.color}
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
            />
            <div>
              <button onClick={() => getFrames(this.state)}>test</button>
              <button onClick={() => showFrame(this.state, this.state.canvas)}>show frame</button>
              <button onClick={() => addProject()}>add project</button>
            </div>
            <div className="dropdown">
              <button class="dropbtn">Dropdown
      `         <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </div>
        </>
      )  
    }
  }

export default Studio;