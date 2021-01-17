FROM node:10
WORKDIR /workdir
ARG GEMFURY
ARG GEMFURY_TOKEN
ARG GEMFURY_EXTERNAL_TOKEN
ARG VERSION

VOLUME [ "./build" ]

RUN npm i -g yarn
RUN which yarn
ENV npm_config_registry="https://npm-proxy.fury.io/$GEMFURY_TOKEN/centrality/"
COPY package.json yarn.lock ./
RUN npm config set always-auth true
RUN yarn

RUN ls -al

COPY . .


RUN yarn build