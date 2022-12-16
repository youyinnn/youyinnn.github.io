#!/bin/bash 
set +e  # Grep succeeds with nonzero exit codes to show results.
git status | grep modified
if [ $? -eq 0 ]
then
    set -e
    git config user.name github-actions
    git config user.email github-actions@github.com
    git add .
    git commit -m "auto commit"
    git push
else
    set -e
    echo "No changes since last run"
fi