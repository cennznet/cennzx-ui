FROM node:10-buster as builder

RUN apt-get update && apt install python3

WORKDIR /app
ADD . /app
RUN rm -rf node_modules/*
RUN rm -rf artifacts/*
RUN yarn install
RUN yarn build
RUN ls dist/


FROM nginx:latest
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf

RUN ls /usr/share/nginx/html
RUN cat /etc/nginx/conf.d/default.conf
