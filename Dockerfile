#FROM node:10.17.0-alpine
FROM node:10-buster

RUN apt-get update && apt install python3

WORKDIR /app
ADD . /app
RUN yarn install
RUN yarn build

CMD yarn start --hostname 0.0.0.0 --port 8080
