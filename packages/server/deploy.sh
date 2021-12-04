#!/usr/bin/env bash

basepath=$(cd `dirname $0`;pwd);
cd ${basepath};

git checkout .;
git pull;

docker build . -t ouduidui/web-crawler-node;

docker run -p 1129:1129 -d ouduidui/web-crawler-node;
