const axios = require('axios');

let instance;
const TvTimeService = {
    init() {
        instance = axios.create({
          baseURL: process.env.TVT_API_URL,
          timeout: 120000,
        });
      },
    get(path) {
        return instance.get(path, {
        }).catch(this.handleError)
    }
}

module.exports = {
    TvTimeService
}
