FROM node:14.18.1

WORKDIR /home/web-crawler-node

COPY . /home/web-crawler-node

RUN npm install

RUN npm run stop

EXPOSE 7001

CMD [ "npm", "run", "start" ]
