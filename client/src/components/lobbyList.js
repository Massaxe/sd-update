import React, { Component } from "react";
import { GetLobbies } from "../io/io";
import Lobby from "./lobby";

export default class LobbyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbies: []
    };
    GetLobbies().then(lobbies => {
      this.setState({ lobbies: lobbies });
    });
  }
  renderLobbies = () => {
    const lobbyElements = [];
    this.state.lobbies.forEach((lobby, index) => {
      console.log(lobby);
      lobbyElements.push(<Lobby lobby={lobby} />);
    });
    return lobbyElements;
  };
  render() {
    return (
      <div>
        <this.renderLobbies />
      </div>
    );
  }
}
