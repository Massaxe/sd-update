const express = require("express"),
  passport = require("passport"),
  session = require("express-session"),
  SteamStrategy = require("passport-steam").Strategy,
  auth = require("./routes/auth"),
  steamApiKey = require("./keys/steamKey").key;

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

app.use(
  session({
    secret: "your secret",
    name: "name of session id",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.send("Hello: " + req.user);
});

const port = 4000;
//const home = "http://localhost:3000";

app.use("/auth", auth);

app.listen(port);
console.log("listening on port: " + port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
