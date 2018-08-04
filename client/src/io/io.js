import io from "socket.io-client";
const socket = io("http://localhost:4001");

socket.on("get socket", () => {
  socket.emit("get socket");
});

function ResponseJoinRequest(accepted, lobbyId) {
  socket.emit("join response", { accepted: accepted, lobbyId: lobbyId });
}

function Test() {
  return new Promise((resolve, reject) => {
    socket.on("hello world", data => console.log(data));
  });
}

function OnConnect() {
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      resolve(true);
    });
  });
}

function OnDisconnect() {
  return new Promise((resolve, reject) => {
    socket.on("disconnect", () => {
      resolve(true);
    });
  });
}

function GetUser() {
  return new Promise((resolve, reject) => {
    socket.on("user info", userInfo => {
      resolve(userInfo);
    });
  });
}

function JoinLobby(lobbyId, steamId) {
  socket.emit("join lobby", { lobbyId: lobbyId, steamId: steamId });
  return new Promise((resolve, reject) => {
    socket.on("join response", data => resolve(data));
  });
}

function createLobby(data) {
  socket.emit("create lobby", data);
}

function AwaitLobbies() {
  return new Promise((resolve, reject) => {
    socket.on("lobby list", data => {
      resolve(data);
    });
  });
}

function AwaitRequest() {
  return new Promise((resolve, reject) => {
    socket.on("join request", data => {
      resolve(data);
    });
  });
}

function GetLobbies() {
  return new Promise((resolve, reject) => {
    socket.emit("get lobbies");
    socket.on("lobby list", data => {
      resolve(data);
    });
  });
}

export {
  GetUser,
  createLobby,
  AwaitLobbies,
  JoinLobby,
  OnConnect,
  OnDisconnect,
  GetLobbies,
  AwaitRequest,
  ResponseJoinRequest,
  Test
};
