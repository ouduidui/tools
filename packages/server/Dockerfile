FROM node:14.18.1

WORKDIR /home/web-crawler-node

COPY package.json /home/web-crawler-node/package.json

RUN npm install

COPY . /home/web-crawler-node

EXPOSE 1129

CMD npm start
