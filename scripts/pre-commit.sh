#!/usr/bin/env bash

if [[ ! -z "${CI}" ]]; then
    # Skip hooks in CI
    exit 0
fi
