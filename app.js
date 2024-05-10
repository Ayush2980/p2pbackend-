const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000 || process.env.PORT;
const mongoose = require("mongoose");
const songSchema = require("./models/songs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const userSchema = require("./models/users");
const roomSchema = require("./models/room");
//router imports
const googleAuth = require("./routes/googleAuth");
const localAuth = require("./routes/localAuth");
const userFunc = require("./routes/userFunc");
//middleware imports
const { deserializeUserCustom } = require("./middlewares");
//database connect
main()
  .then(() => {
    console.log("Database connected !!!");

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log("Server not active !!1");
    console.log(e);
  });
async function main() {
  // await mongoose.connect(
  // "mongodb+srv://threesigmas:HelloLadies@cluster0.ddsxkao.mongodb.net/"
  // );
  mongoose.connect("mongodb://127.0.0.1:27017/ppusher");
}

//middlewares
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());
app.use(
  session({
    secret: process.env.GOOGLE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000000,
      // maxAge: process.env.GOOGLE_SESSION_EXPIRY,
    },
  })
);

//Sockets

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("User connected ", socket.id);
  socket.join(socket.id);
  socket.on("checkSeed" , async() => {
    const sizeof = await roomSchema.find({});
    socket.emit("seedSize", {sizeOf : sizeof.length});     
  });
  socket.on("addSong" , async({splittedAudio}) => {
    let i = 0;
    console.log("Add Song request from " , socket.id);
    const allRooms = await roomSchema.find({});
    allRooms.forEach((e) => {
      io.to(e.socketid).emit(`hello`, {msg : `request for a song from ${socket.id} to ${e.socketid}` , data : splittedAudio[i]});
      i++;
    })

  })
  socket.on("userConnected", async({userId , count}) => {
    const findUser = await userSchema.findById(userId);
    console.log(findUser.username);
    console.log("User Data hit !!!" , count);
    const addUser = new roomSchema({owner : userId , socketid : socket.id});
    await addUser.save();
  });
  socket.on("disconnect", async() => {
    try{
      const deleteRoom = await roomSchema.findOneAndDelete({socketid : socket.id});
      console.log(deleteRoom);
      console.log("Disconnect ", socket.id);
    }
    catch(e){
      console.log(e);
      console.log("User was logged out but room still exists in database !!!");
    }
  });
});

//Main Routes

app.use("/auth/google", googleAuth);
app.use("/", userFunc);
app.use("/", localAuth);
app.get("/home", (req, res) => {
  res.send("<a href='/auth/google'>GO google</a>");
});

app.get("/protected", deserializeUserCustom, (req, res) => {
  console.log("protedted", req.user);
  res.send("pro");
});
