const express = require("express"),
  passport = require("passport"),
  session = require("express-session"),
  SteamStrategy = require("passport-steam").Strategy,
  auth = require("./routes/auth"),
  steamApiKey = require("./keys/key").steam,
  sharedSession = require("express-socket.io-session"),
  uuid = require("uuid/v1"),
  fs = require("fs"),
  CJSON = require("circular-json"),
  mongoose = require("mongoose"),
  User = require("./models/User");

let sessionMiddleware = session({
  secret: "your secret",
  name: "steam",
  resave: true,
  saveUninitialized: true
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:4000/auth/steam/return",
      realm: "http://localhost:4000/",
      apiKey: steamApiKey
    },
    function(identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's Steam profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Steam account with a user record in your database,
        // and return that user instead.
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

const app = express();

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log(err));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.send("Hello: " + req.user.displayName);
});

const port = 4000;
//const home = "http://localhost:3000";

app.use("/auth", auth);

app.listen(port);
console.log("listening on port: " + port);

const io = require("socket.io")(4001).use(
  sharedSession(sessionMiddleware, { autoSave: true })
);

const globalLobbies = [];
const joinRequests = [];
const connectedSockets = [];

let logInterval = setInterval(() => {
  clearInterval(logInterval);
}, 2500);

io.on("connection", socket => {
  try {
    const user = socket.handshake.session.passport.user._json;
    socket.steamUser = user;

    socket.emit("user info", user);

    connectedSockets.push({
      steam: user,
      id: socket.id
    });

    socket.on("create lobby", data => {
      CreateLobby(data, id => {
        socket.join(id);
        socket.join(id + "-cre");
      });
    });
    socket.on("get lobbies", data => {
      socket.emit("lobby list", globalLobbies);
    });
    socket.on("join lobby", data => {
      RequestJoin(data.lobbyId, data.steamId, valid => {
        if (valid) {
          socket.join(data.lobbyId + "-opp");
          socket.join(data.lobbyId);
        }
      });
    });

    socket.on("join response", data => {
      const steamId = GetSteamIdByJoinRequestLobbyId(data.lobbyId);
      JoinLobby(data.lobbyId, steamId, data.accepted);
    });

    socket.on("disconnect", () => {
      RemoveConnectedSocketById(socket.id);
    });
  } catch (err) {}
});

function RemoveConnectedSocketById(id) {
  const mapped = connectedSockets.map(sess => sess.id);
  const index = mapped.indexOf(id);
  connectedSockets.splice(index, 1);
}

async function CreateLobby(data, cb) {
  const inLobby = await CheckIfInLobby(data.user.steamid);
  if (!inLobby) {
    const lobby = {
      amount: data.amount,
      playerNames: [data.user.personaname, ""],
      steamIds: [data.user.steamid, ""],
      id: uuid(),
      joinable: true
    };
    globalLobbies.push(lobby);
    EmitLobbies();
    cb(lobby.id);
  }
}
function CheckIfInLobby(steamId) {
  return new Promise((resolve, reject) => {
    const globalLobbiesOnlySteamIds = globalLobbies.map(
      lobby => lobby.steamIds
    );
    globalLobbiesOnlySteamIds.forEach((lobby, index) => {
      if (lobby.includes(steamId)) {
        resolve(true);
      }
      if (index === globalLobbiesOnlySteamIds.length - 1) {
        resolve(false);
      }
    });
    resolve(false);
  });
}

function EmitLobbies() {
  io.emit("lobby list", globalLobbies);
}

function RequestJoin(lobbyId, steamId, cb) {
  if (GetLobbyByLobbyId(lobbyId).joinable) {
    const joiner = GetSteamUserBySteamId(steamId);
    globalLobbies[GetLobbyIndexByLobbyId(lobbyId)].joinable = false;

    joinRequests.push({
      steamId: steamId,
      lobbyId: lobbyId
    });

    io.to(lobbyId + "-cre").emit("join request", {
      name: joiner.personaname,
      lobbyId: lobbyId
    });

    cb(true);
  }
  cb(false);
}

function GetLobbyIndexByLobbyId(lobbyId) {
  const lobbyIdArray = globalLobbies.map(lobby => lobby.id);
  const index = lobbyIdArray.indexOf(lobbyId);
  return index;
}

function GetLobbyByLobbyId(lobbyId) {
  const lobbyIdArray = globalLobbies.map(lobby => lobby.id);
  const index = lobbyIdArray.indexOf(lobbyId);
  return globalLobbies[index];
}

function GetSteamIdByJoinRequestLobbyId(lobbyId) {
  const lobbyIdArray = joinRequests.map(request => request.lobbyId);
  const index = lobbyIdArray.indexOf(lobbyId);
  return joinRequests[index].steamId;
}

function GetRequestedSocketIdBySteamId(steamId) {
  const mapped = joinRequests.map(req => req.steam.steamid);
  const index = mapped.indexOf(steamId);
  return joinRequests[index].id;
}

function GetSteamUserBySteamId(steamId) {
  const steamUserArray = Object.values(io.sockets).map(
    socket => socket.steamUser
  );
  const steamUser = steamUserArray.filter(steamData => {
    try {
      return steamData.steamid === steamId;
    } catch (err) {}
  });
  return steamUser[0];
}

function JoinLobby(lobbyId, steamId, accepted) {
  if (accepted) {
    const user = GetSteamUserBySteamId(steamId);
    const lobbyIndex = GetLobbyIndexByLobbyId(lobbyId);
    const lobby = globalLobbies[lobbyIndex];

    lobby.playerNames[1] = user.personaname;
    lobby.steamIds[1] = user.steamid;

    globalLobbies[lobbyIndex] = lobby;

    EmitLobbies();
  } else {
    io.to(lobbyId).emit("join response", { accept: accepted });
    globalLobbies[GetLobbyIndexByLobbyId(lobbyId)].joinable = true;
  }
}

function LogJSON(data) {
  const json = CJSON.stringify(data, null, 4);
  const name = `${Date.now()}.json`;
  fs.writeFile(name, json, "utf8", () => {});
}
