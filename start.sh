#!/bin/bash

export DATABASE_URL="stravasight@tcp(localhost:3306)/stravasight"
export PORT=4000

go run *.go &
run_pid=$!

function stop_processes()
{
    echo

    echo Killing pid $run_pid
    kill -9 $run_pid &>/dev/null

    exit
}

trap stop_processes SIGHUP SIGINT SIGTERM
tail -f /dev/null
