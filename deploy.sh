rsync -r -e "ssh -i deploy_rsa -o 'StrictHostKeyChecking no'" $TRAVIS_BUILD_DIR/dist $TRAVIS_BUILD_DIR/package.json root@46.101.45.168:/var/www/sub/gomoku
ssh -i deploy_rsa -o 'StrictHostKeyChecking no' root@46.101.45.168 "cd /var/www/sub/gomoku && npm i"
