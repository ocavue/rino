
# This scrript can clean useless deployment in Vercel. You may need to run this script multiple times since
# it can only delete limit deployments.

set -ex

echo "" > /tmp/clean_vercel_deployment.txt

for project_name in "rino-home" "rino-web" "rino-server"; do
    vercel ls $project_name | egrep -o "$project_name-[a-zA-Z0-9]+.vercel.app" >> /tmp/clean_vercel_deployment.txt
done

cat /tmp/clean_vercel_deployment.txt

vercel remove --yes --safe $(cat /tmp/clean_vercel_deployment.txt | head -n 20 | paste -sd ' ' -)
