#!/bin/bash

sudo su
cd /home/ec2-user/higgins-staging

sudo rm -rf node_modules/node-sass/

sudo npm install --development
sudo npm install node-sass
sudo bower install --allow-root
sudo gulp build

# TODO: Should integrate PM2
pm2 reload higgins-staging

restartReturnCode=$?;
if [[ $restartReturnCode != 0 ]]; then
  sudo mongod &
  PM2_HOME='/home/ec2-user/.pm2' PORT=8080 NODE_ENV=production MONGODB_URI=mongodb://admin:higginsadmin@ds021434.mlab.com:21434/higgins-staging pm2 -u ec2-user start dist/server/index.js --name "higgins-staging"
fi

# port forwarding
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

# for security
sudo rm ./appspec.yml
sudo rm -r ./_deploy
