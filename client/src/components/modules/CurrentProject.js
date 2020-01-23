import React, { Component } from "react";
import {Link} from "@reach/router";

import "./CurrentProject.css"

class CurrentProject extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return(
            <>
                <div className = "Project-Container">
                    <div className = "FakeCanvasContainer">
                        <div className="FakeShadow2"></div>
                        <div className="FakeShadow1"></div>
                        <button onclick="location.href = '../studio/'" className="Frame1">
                            
                        </button>
                    </div>
                    <div className = "Link Container">  
                        <Link to = "../studio/" className = "ProjectDisplay">
                            {this.props.project.name}
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}

export default CurrentProject;