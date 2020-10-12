#!/usr/bin/env bash

set -e

branch=$(git rev-parse --abbrev-ref HEAD)

# https://stackoverflow.com/a/63286099
slugify () {
    echo "$1" | iconv -c -t ascii//TRANSLIT | sed -E 's/[~^]+//g' | sed -E 's/[^a-zA-Z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | tr A-Z a-z
}

slugify ${branch}
