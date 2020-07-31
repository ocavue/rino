
set -ex
cd $(dirname $0)/..

packages=" "

for package in $(cat packages/web/package.json | grep '1.0.0-next' | cut -d ':' -f 1 | cut -d '"' -f 2)
do
    packages="$packages $package@next"
done

echo $packages
yarn web add -D $packages

npx yarn-deduplicate --strategy fewer ./yarn.lock
yarn install
