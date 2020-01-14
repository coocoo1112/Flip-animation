import React, { Component } from "react";

import "../../utilities.css";
import "./Studio.css";


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
           previous_x: null,
           previous_y: null,
        };
        this.canvasRef = React.createRef();    
    }
  
    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "White";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        canvas.addEventListener('mousemove', (event) => {
            const mouse = getMousePos(canvas, event);
            if ((this.state.previous_x != null) && (this.state.previous_x != mouse.x)) {
              ctx.moveTo(this.state.previous_x, this.state.previous_y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke(); 
            }
            if (this.state.previous_x != mouse.x){
              this.setState({
                previous_x: mouse.x,
                previous_y: mouse.y,
              });
            }
        });
    }
  
    render() {
      return (
        <>
            <div class="CanvasContainer">
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
