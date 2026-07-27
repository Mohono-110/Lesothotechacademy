#!/bin/bash
cd /home/z/my-project
while true; do
  bun run dev 2>&1
  echo "Server crashed, restarting in 2 seconds..."
  sleep 2
done
