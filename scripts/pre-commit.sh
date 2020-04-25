#!/usr/bin/env bash

if [[ ! -z "${CI}" ]]; then
    # Skip hooks in CI
    exit 0
fi

# build github action configration
./node_modules/.bin/js-yaml .github/temp/main.yml > .github/workflows/main.yml
