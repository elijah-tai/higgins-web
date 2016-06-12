#!/bin/bash

sudo su
cd /home/ec2-user/higgins-staging

sudo npm install
sudo npm install -g gulp
gulp serve:dist

# TODO: Should integrate PM2
#pm2 reload higgins-staging
#
#restartReturnCode=$?;
#if [[ $restartReturnCode != 0 ]]; then
#  PM2_HOME='/home/ec2-user/.pm2'
#  PORT=9000
#  sudo mongod &
#  pm2 -u ec2-user -i 0 start ./server/app.js --name "higgins-staging"
#fi

# for security
sudo rm ./appspec.yml
sudo rm -r ./_deploy
sudo rm -r ./package.json
