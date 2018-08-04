import React, { Component } from "react";
import { AwaitLobbies, GetLobbies } from "../io/io";
import Lobby from "./lobby";

export default class LobbyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbies: []
    };
    this.getLobbies();
  }

  awaitLobbies = () => {
    AwaitLobbies().then(lobbies => {
      this.setState({ lobbies: lobbies });
    });
  };

  getLobbies = () => {
    GetLobbies().then(lobbies => {
      this.setState({ lobbies: lobbies });
      this.awaitLobbies();
    });
  };

  componentWillUpdate() {
    this.awaitLobbies();
  }

  render() {
    return (
      <div>
        <RenderLobbies lobbies={this.state.lobbies} user={this.props.user} />
      </div>
    );
  }
}

function RenderLobbies(props) {
  const lobbyElements = [];
  props.lobbies.forEach((lobby, index) => {
    lobbyElements.push(<Lobby lobby={lobby} user={props.user} />);
  });
  return lobbyElements;
}
