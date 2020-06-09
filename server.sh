#!/usr/bin/env bash

npm i -g forever
npm i --production

DEBUG=bot:* forever start index.js -o bot.log -e error.log
