import React, { Component } from "react";

import "./Thumbnail.css";

function test() {
    console.log("test passed");
}

class Thumbnail extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            this.props.currentFrame ? (
                <>
                    <button className="button selected">
                        <img className="ThumbnailImage" src={this.props.frame}/>
                    </button>
                </>
            ) : (
                <>
                    <button onClick={this.props.FrameChanger} className="button">
                        <img className="ThumbnailImage" src={this.props.frame}/>
                    </button>
                </>
            )
            
        )
    }
}

export default Thumbnail;