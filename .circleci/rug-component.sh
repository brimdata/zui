#!/bin/bash
# This is a thin thing that pulls in the proper rug.git branch and runs
# it. rug.git is responsible for maintaining and updating this code.
# Updates to it should go there, be tested for all components, and then
# deployed to component repositories as needed.
set -euo pipefail

PRODUCT_BRANCH="nested-records"

rm -rf /var/tmp/rug.git
git clone --depth=1 --branch="${PRODUCT_BRANCH}" git@github.com:looky-cloud/rug.git /var/tmp/rug.git
cd /var/tmp/rug.git
./circleci-build.sh "${PRODUCT_BRANCH}"
