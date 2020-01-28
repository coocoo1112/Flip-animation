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
          thickness: 10,
          canvas: null,
          currentFrame: 0,
          frames: [null],
          frameIds: [null],
          project: null,
          newFrame: false,
          deleteFrame: false,
          switchFrame: false,
          prevFrame: 0,
          play: false,
          projects: [null],
          clearFrame: false,
          playbackSpeed: 1000,
          viewPreviousFrame: true,
          repeatFrame: false,
        };
      this.fs = require("fs");
    }

    changeColor(e) {
      if (e.target.id === "eraser") {
        this.setState({
          color: "white",
        });
      } else {
        console.log(e.target.id);
        this.setState({
          color: "#"+e.target.id,
        })
      }
    }
    
    addProject() {
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
                user: who,
                frameOrder: null,
              };
              this.setState({
                project: nameEntered,
              })
              post("/api/newProject", projectBody)
            });
          });
        }
        else {
          console.log("name taken");
        }
      })
        
    }

    switchProject(name) {
      get("/api/getProject", {project: name}).then((projectSend) => {
        console.log(projectSend)
        const order = projectSend[0].frameOrder;
        console.log(order)
        var temp = [];
        for (var i = 0, len = order.length; i < len; i++) {
          temp.push(null)
        }
        console.log("temp: ", temp)
        for (var i = 0, len = order.length; i < len; i++) {
          const element = order[i];
          const body = {
            project: name,
            idSend: element,
            sequence: i,
          };
          get("/api/getFrame", body).then((frame) => {
            temp.splice(frame.sequence, 1, frame.data)
            console.log(order.length, i, frame)
            //console.log(frame.data)
            
            if (i === order.length) {
              //console.log(temp)
              this.setState({
                frameIds: order,
                frames: temp,
                project: name,
              });

            }
          });
        };
        
        console.log("FRAMES: ", temp)//this.state.frames)
      })
    }

    getProjects() {
      get("/api/getProjects").then((projectsReturned) => {
        
        let projectsDiv = projectsReturned.map((project) => {
          return <button onClick={() => this.switchProject(project.name)}>{project.name}</button>
        })
        this.setState({
          projects: projectsDiv,
        })
        console.log("Div: ", projectsDiv);
        console.log(projectsReturned);
      })
    }

    changeThickness = (newThickness) => {
      this.setState({
        thickness: newThickness,
      })
    }

    saveCanvasImage = (canvas, i) => {
      this.state.frames[i] = canvas.toDataURL("image/png");
      var canvasStream = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      console.log(canvasStream);
      //window.location.href=canvasStream;
      //console.log("test", this.state.currentFrame, this.state.frameIds)
      const body = {
        project: this.state.project,
        stream: canvasStream,
        id: this.state.frameIds[i],//this.state.currentFrame - 1],
      };
      console.log("ID: ", body.id);
      //console.log("2");
      post("/api/sendFrame", body).then((output) => {
        const id = output.id;
        const temp = this.state.frameIds;
        const tempFrames = this.state.frames;
        console.log("index at: ", i)
        temp[i] = id;
        tempFrames[i] = canvasStream;
        this.setState({
          frameIds: temp,
          frames: tempFrames,
        });
        console.log("this is real", this.state.frameIds);
        const body = {
          project: this.state.project,
          order: this.state.frameIds,
        }
        post("/api/updateFrameList", body).then((hi) => {
          console.log("HIIIII", hi)
        })

        //this.state.frameIds[this.state.currentFrame - 1] = id;

        // const bodyGet = {
        //   project: this.state.project,
        //   idSend: id,
        // };
        // get("/api/getFrame", bodyGet).then((frame) => {
        //   var temp = this.state.frames;
        //   temp[i] = frame.data;
        //   this.setState({frames: temp});
        // });
      });
    }



    createNewFrame = () => {
      const curr = this.state.currentFrame;
      var tempFrames = this.state.frames;
      var tempIds = this.state.frameIds;
      tempFrames.splice(curr+1, 0, null);
      tempIds.splice(curr+1, 0, null);
      const prev = this.state.frameIds;
      this.setState({
        frames: tempFrames,
        frameIds: tempIds,
        currentFrame: curr + 1,
        newFrame: true,
      }, () => {
        console.log("State before: ", prev);
        console.log("Current state: ", this.state.frameIds)
      })
      //})
      
      
      // this.state.frames.splice(this.state.currentFrame, 0, null);
      // this.state.frameIds.splice(this.state.currentFrame, 0, null);
      
      
    }

    deleteFrame = () => {
      this.setState({
        currentFrame: this.state.currentFrame-1,
        deleteFrame: true,
      })
      this.state.frames.splice(this.state.currentFrame, 1);
      var tempIds = this.state.frameIds;
      tempIds.splice(this.state.currentFrame, 1);
      this.setState({
        frameIds: tempIds,
      })
    }

    createRepeatFrame = () => {
      const curr = this.state.currentFrame;
      var tempFrames = this.state.frames;
      var tempIds = this.state.frameIds;
      tempFrames.splice(curr+1, 0, null);
      tempIds.splice(curr+1, 0, null);
      this.setState({
        frames: tempFrames,
        frameIds: tempIds,
        repeatFrame: true,
        currentFrame: curr + 1,
      })
    }

    setRepeatFrameFalse = () => {
      this.setState({
        repeatFrame: false,
      })
    }

    clearFrame = () => {
      this.setState({
        clearFrame: true,
      })
    }

    setClearFrameFalse = () => {
      this.setState({
        clearFrame: false,
      })
    }

    setNewFrameFalse = ()  => {
      this.setState({
        newFrame: false,
      })
    }

    setDeleteFrameFalse = () => {
      this.setState({
        deleteFrame: false,
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

    changePlaybackSpeed = (newSpeed) => {
      this.setState({
        playbackSpeed: newSpeed,
      })
    }

    changeViewPreviousFrame = (bool) => {
      this.setState({
        viewPreviousFrame: bool,
        prevFrame: this.state.currentFrame,
        currentFrame: this.state.currentFrame,
        switchFrame: true,
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
              thickness={this.state.thickness}
              saveFrame={this.saveCanvasImage}
              newFrame = {this.state.newFrame}
              deleteFrame = {this.state.deleteFrame}
              setDeleteFrameFalse = {this.setDeleteFrameFalse}
              setNewFrameFalse = {this.setNewFrameFalse}
              switchFrame = {this.state.switchFrame}
              goToFrame = {this.goToFrame}
              setSwitchFrameFalse = {this.setSwitchFrameFalse}
              prevFrame = {this.state.prevFrame}
              play = {this.state.play}
              clearFrame = {this.state.clearFrame}
              setClearFrameFalse = {this.setClearFrameFalse}
              setPlayAnimationFalse = {this.setPlayAnimationFalse}
              playbackSpeed = {this.state.playbackSpeed}
              viewPreviousFrame = {this.state.viewPreviousFrame}
              repeatFrame = {this.state.repeatFrame}
              setRepeatFrameFalse = {this.setRepeatFrameFalse}
            />
            <div>
              <button onClick={() => this.goToFrame(this.state.currentFrame-1)}>Previous</button>
              <button onClick={() => this.goToFrame(this.state.currentFrame+1)}>Next</button>
              <button onClick={() => this.createNewFrame()}>New Frame</button>
              <button onClick={this.createRepeatFrame}>Repeat Frame</button>
            </div>
            <div>
              <button onClick={this.PlayAnimation}>Play</button>
              <button onClick={this.clearFrame}>ClearFrame</button>
              <button onClick={this.deleteFrame}>DeleteFrame</button>
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
              changePlaybackSpeed = {this.changePlaybackSpeed}
              playbackSpeed = {this.state.playbackSpeed}
              changeViewPreviousFrame = {this.changeViewPreviousFrame}
            />
            <div>
              <button onClick={() => this.getProjects()}>test</button>
              <button onClick={() => showFrame(this.state, this.state.canvas)}>show frame</button>
              <button onClick={() => this.addProject()}>add project</button>
            </div>
            <div className="dropdown">
              <button class="dropbtn">Dropdown
               <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                {this.state.projects}
              </div>
            </div>
        </>
      )  
    }
  }

export default Studio;