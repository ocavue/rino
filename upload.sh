set -x 

ROOT=$(dirname $0)
cd $ROOT 
pwd 

function upload {
    date 
    git add .
    git commit --allow-empty -m "chore: trigger ci $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    git pull --rebase
    git push 
}

upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
upload; sleep 600;
