#!/bin/bash

echo "Watching for js file changes..."
make watch &
watch_pid=$!

function stop_processes()
{
    echo

    echo Killing watch with pid $watch_pid
    kill -9 $watch_pid &>/dev/null

    exit
}

trap stop_processes SIGHUP SIGINT SIGTERM
tail -f /dev/null
