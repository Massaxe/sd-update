import React, { Component } from "react";
import "./App.css";
import { GetUser, OnConnect, OnDisconnect } from "./io/io";
import CreateLobby from "./components/createLobby";
import LobbyList from "./components/lobbyList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      connected: false
    };
    this.listenerGetUser();
    this.listenerConnect();
    this.listenerDisconnect();
  }

  listenerDisconnect = async () => {
    while (true) {
      await OnDisconnect();
      this.setState({ connected: false });
    }
  };

  listenerConnect = async () => {
    while (true) {
      await OnConnect();
      this.setState({ connected: true });
    }
  };

  listenerGetUser = async () => {
    while (true) {
      let user = await GetUser();
      this.setState({ user: user });
    }
  };

  renderAuth = () => {
    if (!this.state.user) {
      return <a href="http://localhost:4000/auth/steam"> Log in </a>;
    } else {
      return <a href="http://localhost:4000/auth/logout"> Log out </a>;
    }
  };

  renderUsername = () => {
    if (this.state.user) {
      return <p>{this.state.user.personaname}</p>;
    }
    return <p />;
  };

  render() {
    if (this.state.connected) {
      return (
        <div className="App">
          <this.renderAuth />
          <this.renderUsername />
          <CreateLobby user={this.state.user} />
          <LobbyList user={this.state.user} />
        </div>
      );
    } else {
      return <div className="App">Awaiting connection</div>;
    }
  }
}

export default App;
