#!/usr/bin/env bash

GREEN='\033[0;32m'
NO_COLOR='\033[0m'

branch=$(git rev-parse --abbrev-ref HEAD)

# https://stackoverflow.com/a/63286099
slugify () {
    echo "$1" | iconv -c -t ascii//TRANSLIT | sed -E 's/[~^]+//g' | sed -E 's/[^a-zA-Z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | tr A-Z a-z
}

echo -e "${NO_COLOR}You can visit ${GREEN}https://rino-server-$(slugify ${branch}).ocavue.vercel.app${NO_COLOR} to check the preview deployment (It may task some minutes)"
