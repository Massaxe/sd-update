import React, { Component } from "react";
import { JoinLobby } from "../io/io";

export default class lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joining: false
    };
  }

  render() {
    let lobby = this.props.lobby;
    if (!lobby.joinable) {
      return <div></div>
    }
    return (
      <div className="lobby" key={lobby.steamIds[0]}>
        <p>{lobby.playerNames[0]}</p>
        <p>{lobby.playerNames[1]}</p>
        <p>{lobby.steamIds[0]}</p>
        <p>{lobby.steamIds[1]}</p>
        <p>{lobby.amount}</p>
        <p>{lobby.id}</p>
        <JoinBtn
          lobby={this.props.lobby}
          user={this.props.user}
          joining={this.state.joining}
        />
      </div>
    );
  }
}

function JoinBtn(props) {
  try {
    if (props.user.steamid === props.lobby.steamIds[0]) {
      return <span>Awaiting opponent</span>;
    } else if (props.user && !props.joining && props.lobby.joinable) {
      return (
        <button
          onClick={() => {
            JoinLobby(props.lobby.id, props.user.steamid).then(accept => {
              console.log("Accept: " + accept);
            });
          }}
        >
          Join Lobby
        </button>
      );
    } else {
      return <span>Just waiting around</span>;
    }
  } catch (err) {
    return <span>You're not logged in</span>;
  }
}
