import React, {Component} from "react";

import "./FlipCanvas.css";

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

class FlipCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouse_coord: {
             previous_x: null,
             previous_y: null,
            },
            mouseDown: false,
            canvas: null,
            playFrame: 0,
        };
        this.canvasRef = React.createRef();
        this.canvas = null;
        this.ctx = null;
        this.canvasRef2 = React.createRef();
        this.canvas2 = null;
        this.ctx2 = null;
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        const ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        ctx.fillStyle = "White";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.fillStyle = "black";
        this.canvas2 = this.canvasRef2.current;
        this.ctx2 = this.canvas2.getContext('2d');
        this.ctx2.globalAlpha = 0.2;
        // this.ctx2.fillStyle = "red";
        // this.ctx2.fillRect(0, 0, this.canvas2.width, this.canvas2.height);
        
        this.canvas2.addEventListener('pointerleave', (event) => {
          this.state.mouse_coord.previous_x = null;
          this.state.mouse_coord.previous_y = null;
          this.state.mouseDown = false;
        })
        this.canvas2.addEventListener('pointerdown', (event) => {
          this.state.mouseDown = true;
          ctx.beginPath();
          this.state.mouse_coord.previous_x = null;
          this.state.mouse_coord.previous_y = null;
        })
        this.canvas2.addEventListener('pointerup', (event) => {
          this.state.mouseDown = false;
        })
        this.canvas2.addEventListener('pointermove', (event) => {
            const mouse = getMousePos(this.canvas, event);
            ctx.strokeStyle = this.props.color;
            if (this.state.mouseDown){

              if ((this.state.mouse_coord.previous_x != null) && 
              ((this.state.mouse_coord.previous_x != mouse.x) || (this.state.mouse_coord.previous_y != mouse.y))) {

                ctx.lineCap = 'round';
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

    loadFrame = (frameNumber, shadow=false) => {
        const image = new Image();
        const ctx = this.canvas.getContext("2d");

        if (this.props.frames[frameNumber]) {
            image.src = this.props.frames[frameNumber];
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            }
        }

        if (shadow && this.props.frames[frameNumber - 1]) {
            const image2 = new Image();
            const ctx2 = this.canvas2.getContext("2d");
            
            image2.src = this.props.frames[frameNumber - 1];
            ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
            image2.onload = function () {
                ctx2.drawImage(image2, 0, 0);
            }
        } else {
            this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
        }
        
    }

    blankCanvas() {
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidUpdate() {
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.thickness;

        if (this.props.newFrame) {
            //console.log("new");
            this.props.saveFrame(this.canvas, this.props.currentFrame-1);
            //console.log("1");
            this.blankCanvas();
            this.loadFrame(this.props.currentFrame, this.props.viewPreviousFrame);
            this.props.setNewFrameFalse();
        }

        if (this.props.switchFrame) {
            console.log("previous frame: ", this.props.prevFrame)
            this.props.saveFrame(this.canvas, this.props.prevFrame);
            this.loadFrame(this.props.currentFrame, this.props.viewPreviousFrame);
            this.props.setSwitchFrameFalse();
        }

        if (this.props.clearFrame) {
            this.blankCanvas();
            this.props.setClearFrameFalse();
        }

        if (this.props.play) {

            this.props.saveFrame(this.canvas, this.props.currentFrame);
            console.log("start animation");
            var frame = 0;
            var animationInterval = setInterval(() => {
                console.log("curent frame", frame);
                this.loadFrame(frame);
                frame += 1;
                if (frame == this.props.frames.length) {
                    window.clearInterval(animationInterval);
                    this.props.goToFrame(this.props.frames.length - 1);
                }
            }, this.props.playbackSpeed);
            this.props.setPlayAnimationFalse();
            
        }
    }

    render() {
        return (
            <div class="CanvasContainer">
                
              <div className="Shadow3"></div>
              <div className="Shadow2"></div>
              <div className="Shadow1"></div>
              
              <canvas width="700" height="500" ref={this.canvasRef} class="Canvas"/>

              <canvas width="700" height="500" ref={this.canvasRef2} class="Canvas"/>
            </div>
        )
    }
}

export default FlipCanvas;