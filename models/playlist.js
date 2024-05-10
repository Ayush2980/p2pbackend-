const { number, required } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const playlistSchema = new mongoose.Schema({
    owner : {
        type : ObjectId,
        ref : "User",
        required : true
    },
    songs : [{
        type : ObjectId,
        ref : "Song",
    }],
    likes : [{
        type : ObjectId,
    }],
    public : {
        type : Boolean ,
        default : true
    },
    name : {
        type : String ,
        required : true
    }
});


module.exports = mongoose.model("Playlist" , playlistSchema);