const express = require("express");
const passport = require("passport");
const router = express();

const userSchema = require("../models/users");

router.use(passport.initialize());
router.use(passport.session());

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body.user);
    const user = new userSchema({ username, email });
    const registeredUser = await userSchema.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registered Successfully");
      res.send({success : true , registeredUser});
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
