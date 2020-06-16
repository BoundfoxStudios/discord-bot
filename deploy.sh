#!/usr/bin/env bash

# Denon does not support command chaining yet, so we have to do it here.

source .env

denon bundle

mkdir .deploy
mv bot.js .deploy
cp lock.json .deploy
cp server-configuration/* .deploy/

cd .deploy
rsync -avzhe ssh --progress --delete --remove-source-files ./* $REMOTE_SERVER:~/bot/.deploy

rm -rf .deploy
