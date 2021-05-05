#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
set -ex

: "${SERVICE_NAME:?SERVICE_NAME is required}"
: "${BUILD_NUMBER:?BUILD_NUMBER is required}"

IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"
VERSION="$(date +%m%d).${BUILD_NUMBER}"

# check if we got something in previous command
# if not, use env variable (to make it work on build server)
if ([[ ! $(echo $GEMFURY | wc -m) -gt 30 ]]); then
    GEMFURY="${GEMFURY_MIRROR_URL}"
fi

# test if we have URL
: "${GEMFURY:?GEMFURY url must be defined, use ~/.npmrc or GEMFURY_MIRROR_URL env variable}"

docker build -t "${IMAGE_NAME}" \
       --build-arg GEMFURY="${GEMFURY}" \
       --build-arg GEMFURY_EXTERNAL_TOKEN="$GEMFURY_EXTERNAL_TOKEN" \
       --build-arg GEMFURY_TOKEN="$GEMFURY_TOKEN" \
       --build-arg VERSION="${VERSION}" \
       --build-arg
       -f $DIR/Dockerfile .



docker run -t --rm \
    -v "$(pwd)/build:/workdir/build" \
    --entrypoint="/bin/sh" \
    "${IMAGE_NAME}" \
    "-c" "cp -R dist/* /workdir/build "
