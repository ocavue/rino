#!/usr/bin/env bash

# This script can clean deployments in Vercel that
# don't an active alias. You may or may not need to
# run this script multiple times.
#
# Before running this script, You need to run `npm i -g vercel`
# to install the command line tool `vercel` and run `vercel login`
# to login the vercel account.

set -ex

tmpfile="/tmp/clean_vercel_deployment.txt"
touch $tmpfile

clean() {
    echo "" > $tmpfile

    for project_name in "rino-home" "rino-web" "rino-server"; do
        vercel ls $project_name | egrep -o "$project_name-[a-zA-Z0-9]+.vercel.app" >> $tmpfile
    done

    cat $tmpfile

    vercel remove --yes --safe $(cat $tmpfile | sort --random-sort | head -n 20 | paste -sd ' ' -)
}

clean
until [ "$(cat $tmpfile | wc -l)" -lt "10" ]; do
    sleep 20
    clean
done
