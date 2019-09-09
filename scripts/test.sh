#!/usr/bin/env bash

cd $(dirname $0)/..

if [[ $1 == "unit" ]]; then
    shift 1
    yarn vue-cli-service test:unit --testPathPattern="tests/unit/.*\.spec\.(js|ts)" $@
elif [[ $1 == "e2e" ]]; then
    shift 1
    yarn vue-cli-service test:unit --testPathPattern='tests/e2e/.*\.spec\.(js|ts)' $@
else
    yarn vue-cli-service test:unit $@
fi
