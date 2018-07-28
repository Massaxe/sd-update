import React, { Component } from "react";
import { createLobby } from "../io/io";

export default class CreateLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ""
    };
  }

  handleAmount = e => {
    const value = e.target.value;
    console.log(value);
    if (isNaN(value) || value.substr(0, 1).includes("0")) {
      return;
    }
    this.setState({ amount: value });
  };

  render() {
    return (
      <div className="createLobby">
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
