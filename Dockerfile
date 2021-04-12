FROM node:10.17.0-alpine

RUN apt-get update && apt install python3

WORKDIR /app
RUN yarn install
ADD . /app
RUN yarn install

CMD yarn start