const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    tvTimeId: {
        type: Number,
    },
    showName: {
        type: String,
    },
    episodeNumber: {
        type: Number,
    },
    seasonNumber:{
        type: Number,
    }
});

module.exports = mongoose.model('Episode', EpisodeSchema);
