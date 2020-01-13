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
        this.canvasRef = React.createRef();
    }
  
    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "White";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        

    }

    componentDidUpdate() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.addEventListener('mousemove', function(event) {
            const mouse = getMousePos(canvas, event);
            console.log(mouse.x + ", " + mouse.y);
            ctx.fillStyle = "Black";
            ctx.fillRect(mouse.x, mouse.y, 5, 5);
            // ctx.fill();
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
