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
            const mouse = getMousePos(this.canvas, event);
            ctx.strokeStyle = this.props.color;
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

    loadFrame = (frameNumber) => {
        const image = new Image();
        const ctx = this.canvas.getContext("2d");

        if (this.props.frames[frameNumber]) {
            image.src = this.props.frames[frameNumber];
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            }
        }
    }

    blankCanvas() {
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidUpdate() {
        this.ctx.strokeStyle = this.props.color;
        
        if (this.props.newFrame) {
            this.props.saveFrame(this.canvas, this.props.currentFrame-1);
            this.blankCanvas();
            this.props.setNewFrameFalse();
        }

        if (this.props.switchFrame) {
            this.props.saveFrame(this.canvas, this.props.prevFrame);
            this.loadFrame(this.props.currentFrame);
            this.props.setSwitchFrameFalse();
        }
    }

    render() {
        return (
            <div class="CanvasContainer">
                
              <div className="Shadow3"></div>
              <div className="Shadow2"></div>
              <div className="Shadow1"></div>
              <canvas width="700" height="500" ref={this.canvasRef} class="Canvas" />
              
            </div>
        )
    }
}

export default FlipCanvas;