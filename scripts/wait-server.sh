#!/usr/bin/env bash

# Wait until the server starts to respond.

url=$1

for times in {1..120}
do
    curl --output /dev/null --silent --head --fail $url \
    && break \
    || echo "waitting $url #$times" && sleep 1s
done
