const express = require("express"),
  passport = require("passport"),
  session = require("express-session"),
  SteamStrategy = require("passport-steam").Strategy,
  auth = require("./routes/auth"),
  steamApiKey = require("./keys/steamKey").key,
  sharedSession = require("express-socket.io-session"),
  uuid = require("uuid/v1");

let sessionMiddleware = session({
  secret: "your secret",
  name: "steam",
  resave: true,
  saveUninitialized: true
});

module.exports.sessionMiddleware = sessionMiddleware;

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

let logInterval = setInterval(() => {
  console.log(io.sockets);
  clearInterval(logInterval);
}, 2500);

io.on("connection", socket => {
  try {
    const user = socket.handshake.session.passport.user._json;
    socket.steamUser = user;
    console.log(Object.values(io.sockets));
    socket.on("get user", () => {
      socket.emit("user info", user);
    });
    socket.on("create lobby", data => {
      globalLobbies.push({
        amount: data.amount,
        playerNames: [data.user.personaname, ""],
        steamIds: [data.user.steamid, ""],
        id: uuid()
      });
      EmitLobbies();
    });
    socket.on("join lobby", data => {});

    socket.on("disconnect", () => {});
  } catch (err) {}
});

function GetIndexOfPlayerBySteamId(steamId) {
  pos = players
    .map(function(e) {
      return e.steamid;
    })
    .indexOf(steamid);
  return pos;
}

function EmitLobbies() {
  io.emit("lobby list", globalLobbies);
}
