#!/usr/bin/env bash

rm -rf .deploy

mkdir .deploy

mv bot.js .deploy

cp lock.json .deploy
cp server-configuration/* .deploy/
