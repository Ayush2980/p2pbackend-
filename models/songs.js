const { number } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const songSchema = new mongoose.Schema({
    track : {
        type : String
    },
    artist : {
        type : String,
    },
    tags : [{
        type : String
    }]
});


module.exports = mongoose.model("Song" , songSchema);