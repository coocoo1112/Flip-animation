import React, { Component } from "react";
import {Link} from "@reach/router";

import "./CurrentProject.css"

class CurrentProject extends Component{
    constructor(props){
        super(props);
    }

    redirect_studio(){
        location.href = "../studio/";
    }

    render() {
        return(
            <>
                <div className = "Project-Container">
                    <div className = "FakeCanvasContainer">
                        <div className="FakeShadow2"></div>
                        <div className="FakeShadow1"></div>
                        <Link to = "../studio/">
                            <div className = "Frame1"/>
                        </Link>
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