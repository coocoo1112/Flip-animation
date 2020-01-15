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

class Studio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          mouse_coord: {
           previous_x: null,
           previous_y: null,
          },
          mouseDown: false,
        };
        this.canvasRef = React.createRef();    
    }
  
    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        //ctx.scale(2,2)
        const scale = 1;
        
        // canvas.width = 1400;
        // canvas.height = 1000;
        // canvas.style.width = "700px";
        // canvas.style.height = "500px";
        ctx.fillStyle = "White";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        // canvas.addEventListener('pointerleave', (event) => {
        //   this.state.mouse_coord.previous_x = null;
        //   this.state.mouse_coord.previous_y = null;
        // })
        canvas.addEventListener('pointerdown', (event) => {
          this.state.mouseDown = true;
          ctx.beginPath();
          this.state.mouse_coord.previous_x = null;
          this.state.mouse_coord.previous_y = null;
        })
        canvas.addEventListener('pointerup', (event) => {
          this.state.mouseDown = false;
        })
        canvas.addEventListener('pointermove', (event) => {
            console.log(event.buttons)
            const mouse = getMousePos(canvas, event);
            
            if (this.state.mouseDown){

              if ((this.state.mouse_coord.previous_x != null) && 
              ((this.state.mouse_coord.previous_x != mouse.x * scale) || (this.state.mouse_coord.previous_y != mouse.y * scale))) {
                ctx.strokeStyle = 'Red'
                ctx.moveTo(this.state.mouse_coord.previous_x, this.state.mouse_coord.previous_y);
                ctx.lineTo(mouse.x * scale, mouse.y * scale);
                ctx.stroke(); 
              }
              if ((this.state.mouse_coord.previous_x != mouse.x * scale) || (this.state.mouse_coord.previous_y != mouse.y * scale)){
                this.setState({
                  mouse_coord: {
                    previous_x: mouse.x * scale,
                    previous_y: mouse.y * scale,
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
