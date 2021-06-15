FROM node:15.5-alpine

WORKDIR /home/pse/web

COPY ./package*.json ./

# Install python & build tools for scss, run npm install
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++
# && npm install \
# && apk del .gyp

RUN npm install
RUN apk del .gyp


COPY ./assets ./assets
COPY ./public ./public
COPY ./src ./src
COPY ./vue.config.js .

EXPOSE 8080

CMD ["npm", "run", "serve"]
