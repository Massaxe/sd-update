import io from "socket.io-client";
import lobby from "../components/lobby";
const socket = io("http://localhost:4001");

function GetUser() {
  return new Promise((resolve, reject) => {
    socket.emit("get user");
    socket.on("user info", userInfo => {
      resolve(userInfo);
    });
  });
}

function JoinLobby(lobbyId, steamId) {
  socket.emit("join lobby", { lobbyId: lobbyId, steamId: steamId });
}

function createLobby(data) {
  socket.emit("create lobby", data);
}

function GetLobbies() {
  return new Promise((resolve, reject) => {
    socket.on("lobby list", data => {
      resolve(data);
    });
  });
}

function JoinLobby(data) {
  socket.emit("join lobby");
}

export { GetUser, createLobby, GetLobbies };
