#!/usr/bin/env bash

DEBUG=* deno run --allow-net --allow-env --allow-read --unstable bot.js >> log.txt
