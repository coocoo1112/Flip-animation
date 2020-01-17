import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";
import ToolNavBar from "../modules/ToolNavBar.js"
import ThumbnailBar from "../modules/ThumbnailBar.js"


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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

function newFrame(state, canvas) {
  state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));

  state.frames.splice(state.currentFrame+1, 0, null);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "White";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  state.currentFrame++;
}

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

function previousFrame(state, canvas, ctx) {
  state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));
  if (state.currentFrame == 0) {
    console.log("FIRST PAGE CAN'T GO TO PREVIOUS");
  } else {
    state.currentFrame--;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = state.frames[state.currentFrame];
    
    // console.log(state.currentFrame);
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
    }
    
  }
}

function toFrame(state, canvas, index) {
  state.frames[state.currentFrame] = (canvas.toDataURL("image/png"));
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
          frameURLs: [null],
        };
        this.canvasRef = React.createRef();
        this.canvas = null;
        this.ctx = null;
    }
  
    componentDidMount() {
        this.canvas = this.canvasRef.current;
        const ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        ctx.fillStyle = "White";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        this.canvas.addEventListener('pointerleave', (event) => {
          this.state.mouse_coord.previous_x = null;
          this.state.mouse_coord.previous_y = null;
        })
        this.canvas.addEventListener('pointerdown', (event) => {
          this.state.mouseDown = true;
          ctx.beginPath();
          this.state.mouse_coord.previous_x = null;
          this.state.mouse_coord.previous_y = null;
        })
        this.canvas.addEventListener('pointerup', (event) => {
          this.state.mouseDown = false;
        })
        this.canvas.addEventListener('pointermove', (event) => {
            // console.log(event.buttons)
            const mouse = getMousePos(this.canvas, event);
            
            if (this.state.mouseDown){

              if ((this.state.mouse_coord.previous_x != null) && 
              ((this.state.mouse_coord.previous_x != mouse.x) || (this.state.mouse_coord.previous_y != mouse.y))) {
                ctx.moveTo(this.state.mouse_coord.previous_x, this.state.mouse_coord.previous_y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke(); 
              }
              if ((this.state.mouse_coord.previous_x != mouse.x) || (this.state.mouse_coord.previous_y != mouse.y)){
                this.setState({
                  mouse_coord: {
                    previous_x: mouse.x,
                    previous_y: mouse.y,
                  },
                  mouseDown: this.state.mouseDown,
                });
              }
            }
        });
    }
  
    render() {
      return (
        <>
            {/* <div className="projectName">Project Title</div> */}
            <div class="CanvasContainer">
                
              <div className="Shadow3"></div>
              <div className="Shadow2"></div>
              <div className="Shadow1"></div>
              <canvas width="700" height="500" ref={this.canvasRef} class="Canvas" />
              
            </div>
            <div>
              <button onClick={() => previousFrame(this.state, this.canvas, this.ctx)}>Previous</button>
              <button onClick={() => nextFrame(this.state, this.canvas, this.ctx)}>Next</button>
              <button onClick={() => newFrame(this.state, this.canvas)}>New Frame</button>
            </div>
            <ThumbnailBar 
              className="Thumbnails"
              numFrames={this.state.frames.length}
              currentFrame = {this.state.currentFrame}
              FrameChanger = {(index) => toFrame(this.state, this.canvas, index)}
              frames = {this.state.frames}
            />
            <ToolNavBar
              Colorchanger = {(e) => changeColor(this.ctx, e)}
            />
        </>
      )
      
    }

    
  }
  

class Animation extends React.Component {
    constructor(props) {
      super(props);
      this.state = { angle: 0 };
      this.updateAnimationState = this.updateAnimationState.bind(this);
    }
  
    componentDidMount() {
      this.rAF = requestAnimationFrame(this.updateAnimationState);
    }
  
    updateAnimationState() {
      this.setState(prevState => ({ angle: prevState.angle + 1 }));
      this.rAF = requestAnimationFrame(this.updateAnimationState);
    }
  
    componentWillUnmount() {
      cancelAnimationFrame(this.rAF);
    }
  
    render() {
      return <Studio/>;
    }
}

export default Animation;