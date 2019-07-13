#!/usr/bin/env bash

# Wait until the server starts to respond.

url=$1
until $(curl --output /dev/null --silent --head --fail $url); do
    echo "waitting $url"
    sleep 1s
done
