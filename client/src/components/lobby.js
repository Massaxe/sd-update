import React, { Component } from "react";
import { JoinLobby } from "../io/io";

export default class lobby extends Component {
  joinBtn = (playerIds, id) => {
    if (this.props.user) {
      return <button onClick={() => {
          
      }}>Join Lobby</button>;
    }
    return <span>You're not logged in</span>;
  };

  render() {
    let lobby = this.props.lobby;
    return (
      <div className="lobby" key={lobby.steamIds[0]}>
        <p>{lobby.playerNames[0]}</p>
        <p>{lobby.steamIds[0]}</p>
        <p>{lobby.amount}</p>
        <p>{lobby.id}</p>
      </div>
    );
  }
}
