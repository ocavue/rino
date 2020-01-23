#!/usr/bin/env bash

# Wait until the server starts to respond.

url=$1

    red="\033[0;31m"
  green="\033[0;32m"
 yellow="\033[0;33m"
  reset="\033[0m"

for times in {1..120}
do
    curl --output /dev/null --silent --head --fail --connect-timeout 5 $url \
    && sleep 1s && echo -e "${green}${url} is ready${reset}" && exit 0 \
    || sleep 1s && echo -e "${yellow}waitting ${url} #${times}${reset}"
done

echo -e "${red}Can't connect to ${url}${reset}"
exit 1
