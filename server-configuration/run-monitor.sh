#!/usr/bin/env bash

until ./run.sh; do
    echo "Bot crashed with exit code $?.  Respawning in 10 seconds..." >&2
    sleep 10
done
