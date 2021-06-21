FROM node:15.5-alpine

WORKDIR /home/pse/web

# Install python & build tools for scss
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++
RUN apk del .gyp

COPY ./package*.json ./

RUN npm install --legacy-peer-deps


COPY ./assets ./assets
COPY ./public ./public
COPY ./src ./src
COPY ./vue.config.js .

EXPOSE 8080

CMD ["npm", "run", "serve"]
