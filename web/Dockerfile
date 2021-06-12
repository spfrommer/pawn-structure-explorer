FROM node:15.5-alpine

WORKDIR /home/pse/web

COPY ./package*.json ./

RUN npm install

COPY ./assets ./assets
COPY ./public ./public
COPY ./src ./src
COPY ./vue.config.js .

EXPOSE 8080

CMD ["npm", "run", "serve"]
