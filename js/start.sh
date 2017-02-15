#!/bin/bash

make watch &
watch_pid=$!

python -m SimpleHTTPServer &
serve_pid=$!

function stop_processes()
{
    echo

    echo Killing watch with pid $watch_pid
    kill -9 $watch_pid &>/dev/null
    echo Killing serve with pid $serve_pid
    kill -9 $serve_pid &>/dev/null

    exit
}

trap stop_processes SIGHUP SIGINT SIGTERM
sleep infinity
