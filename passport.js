const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const userSchema = require("./models/users");

passport.serializeUser(async (user, done) => {
  const { email, displayName, picture } = user;
  console.log("Inside Serialize user !!");
  console.log(email, displayName);
  const isUserRegistered = await userSchema.findOne({ email });
  if (!isUserRegistered) {
    console.log("Inside 1");
    const userData = new userSchema({
      email,
      username: displayName,
      dp: picture,
    });
    userData.save();
    return done(null, userData);
  } else return done(null, isUserRegistered);
});

passport.deserializeUser(async (user, done) => {
  console.log("deserailze user !!!");
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT,
      callbackURL: "http://localhost:8000/auth/google/callback",
      passReqToCallback: true,
      scope: ["profile"],
    },
    function (req, accessToken, refreshToken, profile, done) {
      //   console.log(profile);
      return done(null, profile);
    }
  )
);

passport.use(
  new LocalStrategy((username, password, done) => {
    return done(null, { username, password });
  })
);
