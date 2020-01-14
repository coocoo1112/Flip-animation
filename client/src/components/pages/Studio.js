import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";
import ToolNavBar from "../modules/ToolNavBar.js"


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function changeColor(ctx, e) {
  ctx.strokeStyle = e.target.id
  console.log(e.target.id);
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
        // canvas.addEventListener("pointerdown", (event) => {
        //   this.state.mouseDown = true;
        //   ctx.beginPath();
        //   this.state.mouse_coord.previous_x = null;
        //   this.state.mouse_coord.previous_y = null;
        // })
        // canvas.addEventListener('pointerup', (event) => {
        //   this.state.mouseDown = false;
        // })
        // ctx.strokeStyle = "Red";
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
            console.log(event.buttons)
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
            <div class="CanvasContainer">
                
              <div className="Shadow3"></div>
              <div className="Shadow2"></div>
              <div className="Shadow1"></div>
              <canvas width="700" height="500" ref={this.canvasRef} class="Canvas" />
              
            </div>
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
      return <Studio angle={this.state.angle} />;
    }
}

export default Animation;
// ReactDOM.render(<Animation />, document.body);
