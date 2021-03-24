# tvtyggdl-scraper

## Introduction

It's a prototype of a data scraper using the [tvtyggdl-tvt-api](https://github.com/istartedanewsideprojectagain/tvtyggdl-tvt-api) and the [tvtggdl-ygg-api](https://github.com/istartedanewsideprojectagain/tvtyggdl-ygg-api) to cross reference the `to watch` list and the torrent on `yggtorrent` and store it to a mongoDB.

## How it works

It's a nodeJS script that make soome api calls and store the resullt to a database.

## Run with docker

In the docker file we can setup the cron parameter.

Be sure to have a mongoDB nearby or use the `docker-compose` file

1. Build the docker image

   ```bash
   docker build -t tvtyggdl-scraper .
   ```

2. Run it

   ```
   docker run -it tvtyggdl-scraper
   ```

   