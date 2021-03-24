require('dotenv').config();

const mongoose = require('mongoose');
const { YggService } = require('./services/YggService')
const { TvTimeService } = require('./services/TvTimeService')

require('./models/episode.model');
require('./models/torrent.model');

const EpisodeModel = mongoose.model('Episode');
const TorrentModel = mongoose.model('Torrent');
YggService.init();
TvTimeService.init();

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}+/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
}

mongoose.connection.on('connected', () => {
    console.log('Connection Established')
})
mongoose.connection.on('error', (error) => {
    console.log('ERROR: ' + error)
})

const searchTvShowTorrentByName = async (item) => {
    console.info(`Searching ${item}`);
    const { data } = await YggService.get(`/search?name=${item}&category=2145&sub_category=2184&do=search&order=desc&sort=publish_date`);
    return data;

}

const searchEpisodeByNameSeasonAndEpisodeNumber = async (showName,season,episode) => {
    season = `${season}`.padStart(2,'0');
    episode = `${episode}`.padStart(2,'0');
    const str = `S${season}E${episode}`;
    let { result }  = await searchTvShowTorrentByName(showName);
    result = result.filter(torrent => torrent.torrent.includes(str))
    console.log(`founded ${result.length} for ${showName} S${season}E${episode}`)
    return result;
}

const toModel = (object) => {
    const data = {
        tvTimeId: object.episode_id,
        showName: object.name,
        episodeNumber: parseInt(object.episode),
        seasonNumber: parseInt(object.season)
    }
    return new EpisodeModel(data);
}

const getToWatchFromTvTime = async () => {
    console.log(`Get to watch list from TvTime`);
    const { data } = await TvTimeService.get('/');
    return data;
}


const findEpisodeToAdd =async (toWatchList) => {
    console.log('Find episode to add in the DB')
    let episodeToWatchList = [];
    for (let episode of toWatchList){
        if(!await EpisodeModel.exists({ tvTimeId: parseInt(episode.episode_id)})){
            episodeToWatchList.push(episode);
        }
    }
    console.log(`Need to add ${episodeToWatchList.length} items`)


    return episodeToWatchList;
}

const findEpisodeToRemove = async (toWatchList) => {
    console.log('Find episode to remove in the DB')
    let episodesList = await EpisodeModel.find();
    if(episodesList.length <1){
        return [];
    }
    episodesList = episodesList.map( e => e.tvTimeId);
    toWatchList = toWatchList.map(e => parseInt(e.episode_id));
    const episodeToRemove = episodesList.filter(e => !toWatchList.includes(e))
    console.log(`Need to remove ${episodeToRemove.length} items`)
    return episodeToRemove

}

const removeAllEpisodes = async (episodeIdList) => {
    if(episodeIdList.length <1) return;
    for( let id of episodeIdList){
        await EpisodeModel.deleteOne({ tvTimeId: id});
        await removeAllTorrent(id);
    }
}

const saveAllEpisodes = async (episodeList) => {
    if(episodeList.length <1) return;
    for( let episode of episodeList){
        const newEpisode = new EpisodeModel(toModel(episode));
        await newEpisode.save();
    }
}

const saveAllTorrent = async (torrents,showId) => {
    if(torrents.length <1) return;
    for( let torrent of torrents){
        torrent.episodeId = parseInt(showId);
        const newTorrent = new TorrentModel(torrent);
        await newTorrent.save();
    }
}

const removeAllTorrent =async (episodeId) => {
    await TorrentModel.deleteMany({ episodeId: episodeId});
}

const getTorrent = async (episodeList) => {
    for(let episode of episodeList){
        let season = parseInt(episode.season);
        let epi = parseInt(episode.episode);
        const torrents = await searchEpisodeByNameSeasonAndEpisodeNumber(episode.name,season,epi);

        await saveAllTorrent(torrents,episode.episode_id);
    }
}
const scrap = async() => {
    console.log('start main()')

    const toWatch = await getToWatchFromTvTime();
    const episodesToSave = await findEpisodeToAdd(toWatch);
    const episodeToRemove = await findEpisodeToRemove(toWatch);
    await saveAllEpisodes(episodesToSave);
    await getTorrent(episodesToSave);
    await removeAllEpisodes(episodeToRemove);
    console.log('end main()')
    return;
}

const main = () => {
    mongoose.connection.once('open',()=> {
        scrap().then(() => {
            mongoose.connection.close();
        });
    });
}
main();

