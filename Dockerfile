FROM node:10.17.0-alpine

WORKDIR /app
RUN yarn install
ADD . /app
RUN yarn install

CMD yarn start