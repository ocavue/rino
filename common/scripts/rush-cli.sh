#!/usr/bin/env bash

# This sample script will be used in the CI environment, where Rush is not preinstalled.

# Go to the root of the project
cd $(dirname $0)/../..
exec node "common/scripts/install-run-rush.js" "$@"
