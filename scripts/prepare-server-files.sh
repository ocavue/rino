set -ex
cd $(dirname $0)/..
pwd
mkdir -p ./packages/server/files
cp ./packages/web/dist/index.html  ./packages/server/files/web.html
cp ./packages/home/dist/index.html ./packages/server/files/home.html
ls -lrth ./packages/server/files/
