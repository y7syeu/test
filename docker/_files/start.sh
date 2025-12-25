#!/bin/bash


echo $FLAG > /flag
export FLAG="not_flag"
cd /adminbot && nohup node adminbot.js &
cd /app && nohup node app.js &
tail -f /dev/null

