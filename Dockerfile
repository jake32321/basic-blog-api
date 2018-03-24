FROM node:carbon
MAINTAINER Jake j. Reed

WORKDIR /usr/src/app

COPY ./ /usr/src/app
COPY package.json /usr/src/app/package.json

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]