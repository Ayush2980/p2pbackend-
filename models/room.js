const { number, required } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const roomSchema = new mongoose.Schema({
    owner : {
        type : ObjectId,
        ref : "User",
        required : true
    },
    songs : [{
        type : ObjectId,
        ref : "Song",
    }],
    socketid : {
        type : String
    }
});


module.exports = mongoose.model("Room" , roomSchema);