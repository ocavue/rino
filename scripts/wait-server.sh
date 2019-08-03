#!/usr/bin/env bash

# Wait until the server starts to respond.

url=$1

for times in {1..120}
do
    if [[ -f "$(curl --output /dev/null --silent --head --fail $url)" ]]
    then
        break
    else
        echo "waitting $url #$times"
        sleep 1s
    fi
done
