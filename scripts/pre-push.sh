#!/usr/bin/env bash

GREEN='\033[0;32m'
NO_COLOR='\033[0m'

cd $(dirname $0)

branch=$(git rev-parse --abbrev-ref HEAD)

echo -e "${NO_COLOR}You can visit the liks below to check the preview deployments (It may task some minutes to deploy)"
echo -e " - ${GREEN}https://rino-web-$(./slugify.sh ${branch}).ocavue.vercel.app${NO_COLOR}"
echo -e " - ${GREEN}https://rino-home-$(./slugify.sh ${branch}).ocavue.vercel.app${NO_COLOR}"

