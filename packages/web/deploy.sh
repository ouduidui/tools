#!/usr/bin/env bash

basepath=$(cd `dirname $0`;pwd);
cd ${basepath};

git checkout .
git pull;

docker-compose run --rm web-crawler-frontend /bin/bash -x ./build-app.sh;
