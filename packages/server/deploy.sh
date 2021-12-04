#!/usr/bin/env bash

basepath=$(cd `dirname $0`;pwd);
cd ${basepath};

git checkout .;
git pull;

docker build . -t ouduidui/web-crawler-node;

docker run -p 7001:7001 -d ouduidui/web-crawler-node;
