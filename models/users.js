const { number, ref } = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email :{
    type : String,
  },
  history: [{
    type : ObjectId ,
    ref : "Song"
  }],
  starred: [{
    type : ObjectId ,
    ref : "Song"
  }],
  playlist : [{
    type : ObjectId,
    ref : "Playlist"
  }],
  dp : {
    type : String
  }
} , { timestamps: true, });

// userSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("password") || this.isNew) {
//       console.log("Pass : ", this.password);
//       const hashed = await bcrypt.hash(this.password, 10);
//       console.log("hashed : ", hashed);
//       this.password = hashed;
//     }
//     next();
//   } catch (e) {
//     next(e);
//   }
// });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
