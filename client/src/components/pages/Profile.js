import React, { Component } from "react";
import { get } from "../../utilities";
import CurrentProject from "../modules/CurrentProject.js"

import "../../utilities.css";
import "./Profile.css";

function getProjectNames(projects){
  var project_names = [];
  for(var i = 0; i < projects.length; i++){
    project_names.push(projects[i].name)
  }
  return project_names
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      projects: [],
      project_names: [],
      remixes: [],
      didmount: false
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/whoami").then((user) => this.setState({ user: user }));
    get("/api/getProjects").then((projects) => {
      this.setState({projects : projects});
      console.log(this.state.projects);
      this.setState({project_names : getProjectNames(this.state.projects)});
      console.log(this.state.project_names);
      this.setState({didmount : true});
    });//console.log(projects[0]));//this.setState({projects : projects}))    
    
  }

  render() {
    if (!this.state.didmount) {
      return <div> Loading! </div>;
    }
    let current_projects = this.state.projects.slice(0).reverse().map((projectObj, i) => (
      <CurrentProject
        key = {i}
        project = {projectObj}
      />
    ))
    return (
      <div className = "ProfilePageContainer">
        <div className="Profile-Container u-flex">
          <img className="ProfileIcon" src={require("../../../../assets/profile_icon.png")}/>
          <div className="Profile-name-and-stats u-flexColumn">
            <div className="Profile-name u-textCenter">{this.state.user.name}</div>
            <div className="Profile-stats u-flex">
              <div className="stat">
                flipbooks: {this.state.projects.length}
              </div>
              <div className="stat">
                remixes: {this.state.remixes.length}
              </div>
            </div>
          </div>
        </div>
        <hr className="Profile-line" />
        <div className="u-flex Projects-Container">
          {current_projects}
        </div>
      </div>
    );
  }
}

export default Profile;
