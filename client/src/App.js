import React, { Component } from "react";
import "./App.css";
import { LogSocket } from "./io/io";

class App extends Component {
  componentDidMount() {
    LogSocket();
  }

  render() {
    return (
      <div className="App">
        <a href="http://localhost:4000/auth/steam"> Log in </a>
      </div>
    );
  }
}

export default App;
