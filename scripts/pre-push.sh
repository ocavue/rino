#!/usr/bin/env bash

GREEN='\033[0;32m'
NO_COLOR='\033[0m'

branch=$(git rev-parse --abbrev-ref HEAD)

# https://stackoverflow.com/a/63286099
slugify () {
    echo "$1" | iconv -c -t ascii//TRANSLIT | sed -E 's/[~^]+//g' | sed -E 's/[^a-zA-Z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | tr A-Z a-z
}

echo -e "${NO_COLOR}You can visit the liks below to check the preview deployments (It may task some minutes to deploy)"
echo -e " - ${GREEN}https://rino-web-$(slugify ${branch}).ocavue.vercel.app${NO_COLOR}"
echo -e " - ${GREEN}https://rino-home-$(slugify ${branch}).ocavue.vercel.app${NO_COLOR}"

