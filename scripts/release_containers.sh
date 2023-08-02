#!/bin/bash

set -e
function log() {
    echo "---> ${1}"
}

VERSION=$(cat VERSION)
DOCKERHUB_USERNAME=

# Authenticate to dockerhub
echo "$GITHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin


readonly repo_base="ghcr.io/ipcrm/pandoras-box"


## Build Docker Images
docker build -t "${repo_base}/reporter-be:latest" -f docker/backend .
docker build -t "${repo_base}/reporter-fe:latest" -f docker/frontend .

## Tag to version
docker tag "${repo_base}/reporter-be:latest" "${repo_base}/reporter-be:v${VERSION}"
docker tag "${repo_base}/reporter-fe:latest" "${repo_base}/reporter-fe:v${VERSION}"

## Push Images
docker push "${repo_base}/reporter-be:latest"
docker push "${repo_base}/reporter-fe:latest"
docker push "${repo_base}/reporter-be:v${VERSION}"
docker push "${repo_base}/reporter-fe:v${VERSION}"
