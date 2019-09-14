#!/usr/bin/env bash

cd $(dirname $0)/..

if [[ $1 == "unit" ]]; then
    shift 1
    yarn vue-cli-service test:unit --testPathPattern="tests/unit/.*\.spec\.(js|ts)" $@
elif [[ $1 == "e2e" ]]; then
    shift 1
    # All e2e tests are connected to the same database. In e2e mode, use `--runInBand` to run all tests serially, so that tests do not affect each other.
    yarn vue-cli-service test:unit --testTimeout 30000 --testPathPattern='tests/e2e/.*\.spec\.(js|ts)' --runInBand $@
else
    yarn vue-cli-service test:unit --testTimeout 30000 --runInBand $@
fi
