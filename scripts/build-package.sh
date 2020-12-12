#!/usr/bin/env bash

cd $(dirname $0)/..

find ./packages -type d -name '.next' -o -name 'dist' | grep -v node_modules | xargs rm -rf

set -e

for pkg in $@; do
    echo "building $pkg"
    yarn run $pkg build
done
