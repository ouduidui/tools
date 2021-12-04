FROM node:14.18.1

WORKDIR /home/tool-egg-server

COPY . /home/tool-egg-server

RUN npm install

RUN npm run stop

EXPOSE 7001

CMD [ "npm", "run", "start" ]
