#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

touch .env
export $(cat .env | xargs)

if [[ $1 == "unit" ]]; then
    shift 1
    yarn jest --testPathPattern="tests/unit/.*\.spec\.(js|ts)" $@
elif [[ $1 == "e2e" ]]; then
    shift 1
    scripts/wait-server.sh http://localhost:3000
    # All e2e tests are connected to the same database. In e2e mode, use `--runInBand` to run all tests serially, so that tests do not affect each other.
    yarn jest --testTimeout 30000 --testPathPattern='tests/e2e/.*\.spec\.(js|ts)' --runInBand $@
else
    scripts/wait-server.sh http://localhost:3000
    yarn jest --testTimeout 30000 --runInBand $@
fi
