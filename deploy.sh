#!/usr/bin/bash


docker stop code
docker rm $(docker ps -a -q)
docker run -d --rm --name code -ti neoclear/conterview-code-engine
docker-compose down
docker-compose up -d --build
