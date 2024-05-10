const playlistSchema = require("../models/playlist");
const userSchema = require("../models/users");
module.exports = {
    makePlaylists : async(req , res ,next) => {
        try{
            const {songs , name ,public } = req.body;
            const newPlaylist = new playlistSchema({songs , name  , public , owner : req.user._id});
            const savedPlaylist = await newPlaylist.save();
            const updatedUser = await userSchema.findByIdAndUpdate({_id : req.user._id} ,{$push : {playlist : savedPlaylist._id}});
            return res.send({success : true , playlist : newPlaylist});
        }
        catch(e){
            next(e);
        }
    },
    getPlaylist : async(req , res , next) => {
        try{
            const publicPlaylists = await playlistSchema.find({public: true});
            res.send({success : true , publicPlaylists});
        }
        catch(e){
            next(e);
        }
    },
    deletePlayList : async(req , res,next) => {
        try{
            const {playlistId} = req.body;
            const playlist = await playlistSchema.findById(playlistId);
            if(!playlist) return new Error("No such Plalist Exists !!");
            if(parseInt(req.user._id) != parseInt(playlist._id)) return new Error("Unauthorized Access !!");
            const deletePlaylist = await playlistSchema.findByIdAndDelete(playlistId);
            const updatedUser = await userSchema.findByIdAndUpdate({_id : req.user._id} , {$pull : {playlist : deletePlaylist._id}});
            res.send({success : true , deletePlaylist});
        }
        catch(e){
            next(e);
        }
    },
    starPlayList : async(req , res,next) => {
        try{
            const {playlistId} = req.body;
            const playlist = await playlistSchema.findById(playlistId);
            if(!playlist || playlist.public == false) return new Error("No such Public Plalist Exists !!");
            const updatedUser = await userSchema.findByIdAndUpdate({_id : req.user._id} , {$push: {starred : playlistId}});
            res.send({success : true , updatedUser});
        }
        catch(e){
            next(e);
        }
    },
    unstarPlaylist : async(req ,res , next) => {
        try{
            const {playlistId} = req.body;
            const playlist = await playlistSchema.findById(playlistId);
            if(!playlist || playlist.public == false) return new Error("No such Public Plalist Exists !!");
            const updatedUser = await userSchema.findByIdAndUpdate({_id : req.user._id} , {$pull: {starred : playlistId}});
            res.send({success : true , updatedUser});
        }catch(e){
            next(e);
        }
    },
    addSong : async(req , res ,next) => {
        try{
            const {playlistId , songId} =  req.body;
            const playlist = await playlistSchema.findById(playlistId);
            if(parseInt(req.user._id) != parseInt(playlist._id)) return new Error("Unauthorized Access !!");
            const updatedPlaylist = await playlistSchema.findByIdAndUpdate(playlistId , {$push : {songs : songId}} , {new : true});
            res.send({success : true , updatedPlaylist});
        }
        catch(e){
            next(e);
        }
    },
    removeSong : async(req , res ,next) => {
        try{
            const {playlistId , songId} =  req.body;
            const playlist = await playlistSchema.findById(playlistId);
            if(parseInt(req.user._id) != parseInt(playlist._id)) return new Error("Unauthorized Access !!");
            const updatedPlaylist = await playlistSchema.findByIdAndUpdate(playlistId , {$pull : {songs : songId}} , {new : true});
            res.send({success : true , updatedPlaylist});
        }
        catch(e){
            next(e);
        }
    },
    getUserPlaylist : async(req ,res) => {
        try{
            const {playlist} = await userSchema.findById({_id : req.user._id}).populate('playlist');
            res.send({playlist});
        }
        catch(e){
            next(e);
        }
    }
    
}