import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Welcome.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.canvasRef = React.createRef();
        this.logoRef = React.createRef();
        this.circle1 = new FloatingCircle("#9EC2C2", 0.5);
        this.circle2 = new FloatingCircle("#9EC2C2", 0.5);
        this.circle3 = new FloatingCircle("#9EC2C2", 0.5);
        this.circle4 = new FloatingCircle("#9EC2C2", 0.5);
        this.circle5 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle6 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle7 = new FloatingCircle("#EDAB3A", 0.5);
        this.circle8 = new FloatingCircle("#EDAB3A", 0.5);
    }

    componentDidMount() {
      // remember -- api calls go here!\
      
    }

    componentDidUpdate() {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#618282";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#84AAAA";

      this.circle1.draw(ctx, canvas);
      this.circle2.draw(ctx, canvas);
      this.circle3.draw(ctx, canvas);
      this.circle4.draw(ctx, canvas);
      this.circle5.draw(ctx, canvas);
      this.circle6.draw(ctx, canvas);
      this.circle7.draw(ctx, canvas);
      this.circle8.draw(ctx, canvas);   
      // console.log(this.props.onSuccess) 
    }
  
    render() {
      return (
        <>
          
          <div class="CanvasContainer">
            {this.props.userId ? (
              <GoogleLogout
                className="GoogleBUtton"
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.props.handleLogout}
                onFailure={(err) => console.log(err)}
              />
            ) : (
              <GoogleLogin
                className="GoogleButton"
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={this.props.handleLogin}
                onFailure={(err) => console.log(err)}
              />
            )}
            <div class="welcomeText">Welcome To</div>
            <img src = {require("../../../../assets/flip_logo-2.png")} class="bigLogo"/>
            {/* <div class="buttonContainer">
              <div class="linkContainer">
                <a 
                  class="goButton"
                  href = "/studio/">
                    Let's Get Started
                </a>
              </div>
            </div> */}
            
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

    draw(ctx, canvas) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath()
      ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
      ctx.fill()

      this.x += this.dx;
      this.y += this.dy;

      if (this.x > canvas.width + this.width) {
        this.x = -this.width;
      }
      if (this.x < -this.width) {
        this.x = canvas.width + this.width;
      }
      if (this.y > canvas.height + this.width) {
        this.y = -this.width;
      }
      if (this.y < -this.width) {
        this.y = canvas.height + this.width;
      }
    }
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
      return <Welcome handleLogin={this.props.handleLogin} handleLogout = {this.props.handleLogout}/>;
    }
}

export default WelcomeAnimation;