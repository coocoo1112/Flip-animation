import React, { Component } from "react";

import "../../utilities.css";
import "./Welcome.css";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.logoRef = React.createRef();
        this.circle1 = new FloatingCircle("#84AAAA");
        this.circle2 = new FloatingCircle("#84AAAA");
        this.circle3 = new FloatingCircle("#84AAAA");
        this.circle4 = new FloatingCircle("#84AAAA");
        this.circle5 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle6 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle7 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle8 = new FloatingCircle("#EDAB3A", 0.5);
    }

    componentDidUpdate() {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#618282";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#84AAAA";

      this.circle1.draw(ctx);
      this.circle2.draw(ctx);
      this.circle3.draw(ctx);
      this.circle4.draw(ctx);
      this.circle5.draw(ctx);
      this.circle6.draw(ctx);
      this.circle7.draw(ctx);
      this.circle8.draw(ctx);    
    }
  
    render() {
      return (
        <>
          
          <div class="CanvasContainer">
            <div class="welcomeText">Welcome To</div>
            <img src = {require("../../../../assets/flip_logo-2.png")} class="bigLogo"/>
            <div class="buttonContainer">
              <button class="goButton">Let's Get Started</button>
            </div>
            
            <canvas width={innerWidth} height={innerHeight} ref={this.canvasRef} class="Canvas" />
            
          </div>
        </>
      )
      
    }
}

class FloatingCircle {
    constructor(color, alpha = 1.0) {
      this.color = color;
      this.alpha = alpha;
      this.x = Math.floor(Math.random() * innerWidth);
      this.y = Math.floor(Math.random() * innerHeight);
      this.dx = Math.random() * 1 - 0.5;
      this.dy = Math.random() * 1 - 0.5;
      this.width = (Math.random() * 200) + 50;
      this.height = this.width;
    }

    // constructor(color, alpha, x, y, dx, dy, diameter) {
    //   this.color = color;
    //   this.alpha = alpha;
    //   this.x = x;
    //   this.y = y;
    //   this.dx = dx;
    //   this.dy = dy;
    //   this.width = diameter;
    //   this.height = diameter;
    // }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath()
      ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
      ctx.fill()

      this.x += this.dx;
      this.y += this.dy;
    }

    // duplicate(x, y) {
    //   const duplicate = new FloatingCircle(
    //     this.color,
    //     this.alpha,
    //     this.x,
    //     this.y,
    //     this.dx,
    //     this.dy,
    //     this.width
    //   )
    //   return duplicate;
    // }
}

class WelcomeAnimation extends React.Component {
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
      return <Welcome angle={this.state.angle} />;
    }
}

export default WelcomeAnimation;
// ReactDOM.render(<Animation />, document.body);
