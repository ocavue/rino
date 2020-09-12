
# This scrript can clean useless deployment in Vercel. You may need to run this script multiple times since
# it can only delete limit deployments one time.

set -ex

vercel ls rino-home | egrep -o 'rino-home-[a-zA-Z0-9]+.vercel.app' > /tmp/clean_vercel_deployment.txt
vercel ls rino-web | egrep -o 'rino-web-[a-zA-Z0-9]+.vercel.app' >> /tmp/clean_vercel_deployment.txt

cat /tmp/clean_vercel_deployment.txt

vercel remove --yes --safe $(cat /tmp/clean_vercel_deployment.txt | paste -sd ' ' -)