#!/usr/bin/bash

docker-compose build
docker-compose down
docker stop code
docker rm $(docker ps -a -q)
docker run -d --rm --name code -ti neoclear/conterview-code-engine
docker-compose up -d
