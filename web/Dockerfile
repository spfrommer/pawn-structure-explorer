FROM node:15.5-alpine

WORKDIR /home/webtrace/web

COPY ./package*.json ./


COPY ./assets ./assets
COPY ./public ./public
COPY ./src ./src
COPY ./vue.config.js .

EXPOSE 8080

RUN npm install

CMD ["npm", "run", "serve"]
