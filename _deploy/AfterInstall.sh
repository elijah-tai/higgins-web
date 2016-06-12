#!/bin/bash

sudo su
cd /home/ec2-user/higgins-staging

# TODO: Should integrate PM2
pm2 reload higgins-staging

restartReturnCode=$?;
if [[ $restartReturnCode != 0 ]]; then
  sudo mongod &
  PM2_HOME='/home/ec2-user/.pm2' PORT=8080 NODE_ENV=production pm2 -u ec2-user -i 0 start dist/server/index.js --name "higgins-staging"
fi

# for security
sudo rm ./appspec.yml
sudo rm -r ./_deploy
sudo rm -r ./package.json