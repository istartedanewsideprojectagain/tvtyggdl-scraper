const axios = require('axios');

let instance;
const YggService = {
    init() {
        instance = axios.create({
          baseURL: process.env.YGG_API_URL,
          timeout: 120000,
        });
      },
    get(path) {
        return instance.get(path, {
        }).catch(console.log)
    }
}

module.exports = {
    YggService
}
