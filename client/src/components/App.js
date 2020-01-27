import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Studio from "./pages/Studio.js";
import Profile from "./pages/Profile.js";
import Welcome from "./pages/Welcome.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import NavBar from "./modules/NavBar.js";
import ToolNavBar from "./modules/ToolNavBar.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        {this.state.userId || true?  (
          <>
          <NavBar/>
          <div>
            <Router>
              <Skeleton
                path="/"
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                userId={this.state.userId}
              />
              <Studio
                path="/studio/"
              />
              <Profile path="/profile/"/>
              <ToolNavBar path="/toolBar/"/>
              <NavBar path="nav"/>
              <NotFound default />
            </Router>
          </div>
          </>
        ) : (
          <>
            <Welcome
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
          </>
        )}
      </>
    );
  }
}

export default App;
