require("dotenv").config();
module.exports = {
  deserializeUserCustom: (req, res, next) => {
    try {
        //google auth 
      if (req.session && req.session.passport && req.session.passport.user) {
        req.user = req.session.passport.user;
        console.log(req.session.passport, "fromm midleware");
        return next();
      }
      //write else if for local strategy 
      else{
        return res.redirect("/auth/google");
      }
    } catch (e) {
        next(e);
    }
  },
};
