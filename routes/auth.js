const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  client = "http://localhost:3000";

router.get(
  "/steam",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function(req, res) {
    console.log("login success");
    res.redirect(client);
  }
);

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/steam/return",
  // Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail
  function(req, res, next) {
    console.log(req.originalUrl);
    req.url = req.originalUrl;
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect(client);
  }
);

module.exports = router;
