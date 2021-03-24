const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TorrentSchema = new Schema({
    id: {
        type: String,
        unique:true
    },
    torrent: {
        type: String,
    },
    age:{
        type: String,
    },
    size:{
        type: String,
    },
    s:{
        type: String,
    },
    l:{
        type: String
    },
    episodeId:{
        type: Number,
        ref:'Episode'
    }
});
module.exports = mongoose.model('Torrent', TorrentSchema);
