#!/usr/bin/env bash

set -ex

pwd

mkdir -p ./dist
rm -rf ./dist

yarn run build:analyze
# yarn run build

yarn run export

find ./dist -name '*.html' | grep -v 'dist/index.html' | xargs -L 1 rm

find ./dist -name '*.html'

# yarn run lhci collect --url http://0.0.0.0:8080/ --numberOfRuns=1
# yarn run lhci assert

yarn run lhci autorun --collect.numberOfRuns=1