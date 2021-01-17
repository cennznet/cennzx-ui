#!/usr/bin/env bash

NEW_SSH_RSA_FILE_PATH=~/.ssh/id_rsa

# dir holding this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source $DIR/validate_package_namespaces.sh
source $DIR/prevent_jenkins_rebuild.sh

# set shell to verbose, instant exit mode
set -ex

# Required Environment variables. Set them by using the commands below
# export SERVICE_NAME=reponame
# export BUILD_NUMBER=1
: "${SERVICE_NAME:?SERVICE_NAME environment variable is required}"
: "${BUILD_NUMBER:?BUILD_NUMBER environment variable is required}"

IMAGE_NAME="centralityexternals/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"

cp $NEW_SSH_RSA_FILE_PATH ./git-ssh-key

docker build \
  -t "$IMAGE_NAME" \
  --build-arg GIT_NAME="$GIT_NAME" \
  --build-arg GIT_EMAIL="$GIT_EMAIL" \
  --build-arg GIT_BRANCH="$GIT_BRANCH" \
  --build-arg GEMFURY_TOKEN="$GEMFURY_TOKEN" \
  -f $DIR/Dockerfile .
