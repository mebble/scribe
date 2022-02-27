#!/bin/bash

cd /proc
for f in $(ls | grep -i '[0-9]'); do
  cmdfile=/proc/$f/cmdline
  if [ -f $cmdfile ]; then
    cmd=$(tr -d '\0' < $cmdfile)
    if [[ ! -z $cmd ]]; then
      output=$(printf "$f -> $cmd")
      echo $output
    fi
  fi
done
