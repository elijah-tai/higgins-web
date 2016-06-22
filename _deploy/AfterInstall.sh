#!/bin/bash

sudo su
cd /home/ec2-user/higgins-staging

sudo rm -rf node_modules/node-sass/

sudo npm install
sudo npm install --save node-sass
sudo gulp build

# TODO: Should integrate PM2
pm2 reload higgins-staging

restartReturnCode=$?;
if [[ $restartReturnCode != 0 ]]; then
  sudo mongod &
  PM2_HOME='/home/ec2-user/.pm2' PORT=8080 NODE_ENV=production MONGODB_URI=mongodb://admin:higginsadmin@ds021434.mlab.com:21434/higgins-staging pm2 -u ec2-user start dist/server/index.js --name "higgins-staging"
fi

# for security
sudo rm ./appspec.yml
sudo rm -r ./_deploy
