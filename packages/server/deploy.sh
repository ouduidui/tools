#!/usr/bin/env bash

basepath=$(cd `dirname $0`;pwd);
cd ${basepath};

git checkout .;
git pull;

docker rm $(docker stop $(docker ps -a -q --filter ancestor=ouduidui/tool-egg-server --format="{{.ID}}"))

docker build . -t ouduidui/tool-egg-server;

docker run -p 7001:7001 -d ouduidui/tool-egg-server;
