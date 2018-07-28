import React, { Component } from "react";
import "./App.css";
import { GetUser } from "./io/io";
import CreateLobby from "./components/createLobby";
import LobbyList from "./components/lobbyList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.getUser();
  }

  getUser = async () => {
    let user = await GetUser();
    this.setState({ user: user });
  };

  renderLogin = () => {
    console.log(this.state.user);
    if (!this.state.user) {
      return <a href="http://localhost:4000/auth/steam"> Log in </a>;
    } else {
      return <a href="http://localhost:4000/auth/logout"> Log out </a>;
    }
  };

  renderUser = () => {
    if (this.state.user) {
      return <p>{this.state.user.personaname}</p>;
    }
    return <p />;
  };

  render() {
    return (
      <div className="App">
        <this.renderLogin />
        <this.renderUser />

        <CreateLobby user={this.state.user} />
        <LobbyList user={this.state.user} />
      </div>
    );
  }
}

export default App;
