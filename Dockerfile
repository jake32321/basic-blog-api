FROM node:carbon

WORKDIR /usr/src/app

COPY ./ /usr/src/app
COPY package.json /usr/src/app/package.json

RUN npm install
RUN ls
EXPOSE 3000

CMD [ "npm", "start" ]