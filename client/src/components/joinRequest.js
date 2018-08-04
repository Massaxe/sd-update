import React, { Component } from "react";

export default class JoinRequest extends Component {
  render() {
    return (
      <div>
        <p>{this.props.user.personaname} wants to join your lobby</p>
        <button
          onClick={() => {
            this.props.response(true);
          }}
        >
          Accept
        </button>
        <button
          onClick={() => {
            this.props.response(false);
          }}
        >
          Decline
        </button>
      </div>
    );
  }
}
