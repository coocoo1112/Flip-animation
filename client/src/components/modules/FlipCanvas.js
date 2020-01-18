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
            // color: "000000",
            canvas: null,
            // frames: [null],
            // frameURLs: [null],
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
            // console.log(this.props.color);
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

    loadFrame = (frame) => {
        const image = new Image();
        const ctx = this.canvas.getContext("2d");
        console.log("draw frame", frame);
        // console.log(this.props.frames[this.props.currentFrame]);
        if (this.props.frames[frame]) {
            image.src = this.props.frames[frame];
            console.log(image.src);
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                // ctx.fillStyle = "red";
                // ctx.fillRect(0, 0, 300, 300);
            }
        }
        // this.ctx.fillStyle = "red";
        // this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    blankCanvas() {
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidUpdate() {
        this.ctx.strokeStyle = this.props.color;
        // console.log("saving");
        

        if (this.props.save) {
            console.log("save");
            this.props.saveFrame(this.canvas);
        }
        // console.log(this.props.currentFrame);
        // console.log(this.state.currentFrame);
        if (this.props.newFrame) {
            console.log("newFrame");
            // console.log("test worked");
            // this.props.newFrame = false;
            this.blankCanvas();
            this.props.setNewFrameFalse();
            this.setState({
                currentFrame: this.props.currentFrame,
            })
            // console.log(this.props.newFrame);
        }

        // if (this.props.currentFrame != this.state.currentFrame) {
        //     this.loadFrame();
        //     this.setState({
        //         currentFrame: this.props.currentFrame,
        //     })
        // }
        if (this.props.changeFrame) {
            this.loadFrame(this.props.currentFrame);
            this.props.setChangeFrameFalse();
        }
        // this.props.save(this.canvas);
    }

    render() {
        console.log("currentFrame", this.props.currentFrame);
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



// class FlipCanvasAnimation extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { angle: 0 };
//         this.updateAnimationState = this.updateAnimationState.bind(this);
//     }

//     componentDidMount() {
//         this.rAF = requestAnimationFrame(this.updateAnimationState);
//     }

//     updateAnimationState() {
//         this.setState(prevState => ({ angle: prevState.angle + 1 }));
//         this.rAF = requestAnimationFrame(this.updateAnimationState);
//     }

//     componentWillUnmount() {
//         cancelAnimationFrame(this.rAF);
//     }

//     // componentDidUpdate() {
//     //     console.log("Change color to",this.props.color);
//     // }

//     render() {
//         return (
//             <FlipCanvas
//                 color = {this.props.color}
//                 save = {this.props.save}
//             />)
//         ;
//     }
// }

export default FlipCanvas;