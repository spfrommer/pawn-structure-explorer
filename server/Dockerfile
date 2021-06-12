FROM node:15.5-alpine

WORKDIR /home/pse/server

COPY ./package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 8081

CMD ["npm", "run", "serve"]
