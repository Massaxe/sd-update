import React, { Component } from "react";
import { createLobby, AwaitRequest, ResponseJoinRequest } from "../io/io";
import JoinRequest from "./joinRequest";

export default class CreateLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      userRequest: { personaname: "" },
      requested: false,
      lobbyId: ""
    };
    this.listenerAwaitRequest();
  }

  handleAmount = e => {
    const value = e.target.value;
    console.log(value);
    if (
      isNaN(value) ||
      value.substr(0, 1).includes("0") ||
      value.includes(".")
    ) {
      return;
    }
    this.setState({ amount: value });
  };

  handleRequestResponse = accepted => {
    ResponseJoinRequest(accepted, this.state.lobbyId);
    this.setState({ requested: false });
  };

  requestCheck = () => {
    if (this.state.requested) {
      return (
        <JoinRequest
          user={this.state.userRequest}
          response={this.handleRequestResponse}
        />
      );
    } else {
      return <span />;
    }
  };

  listenerAwaitRequest = async () => {
    while (true) {
      const data = await AwaitRequest();
      this.setState({
        requested: true,
        userRequest: { personaname: data.name },
        lobbyId: data.lobbyId
      });
    }
  };

  render() {
    return (
      <div className="createLobby">
        <this.requestCheck />
        <input
          type="text"
          name=""
          id=""
          value={this.state.amount}
          onChange={this.handleAmount}
        />
        <input
          type="button"
          value="Create Lobby"
          onClick={() => {
            createLobby({ amount: this.state.amount, user: this.props.user });
          }}
        />
      </div>
    );
  }
}
