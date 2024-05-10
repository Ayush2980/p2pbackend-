const express = require("express");
const passport = require("passport");
const router = express();
require("../passport");

router.use(passport.initialize());
router.use(passport.session());


//this will redirect to the ui page provided by google
router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//This route is hit after user selects the account
router.get(
  "/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "http://localhost:8000/auth/google/success",
    failureRedirect: "/failure",
    failureFlash: true,
  })
);

//On failure 
router.get("/failure", (req, res) => {
  console.log(req.user);
  res.send("failure");
});

//On success
router.get("/success", (req, res) => {
  res.send("<a href='/protected'>holapapix</a>");
});
//local login

module.exports = router;
