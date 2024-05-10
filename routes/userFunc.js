const express = require("express");
const router = express();
const {getUserPlaylist , addSong, removeSong,deletePlayList , starPlayList , unstarPlaylist , getPlaylist , makePlaylists} = require("../controllers/userFunc");

router.get("/playlist" , getPlaylist);
router.post("/starPlaylist" , starPlayList);
router.post("/unstarPlaylist" , unstarPlaylist);
router.post("/deletePlaylist" , deletePlayList);
router.post("/makePlaylist" , makePlaylists);
router.post("/addsong" , addSong);
router.post("/removesong" , removeSong);
router.post("/user/playlist" , getUserPlaylist);

module.exports = router;