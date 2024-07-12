#!/bin/sh
# build.sh ver. 20240710192202 Copyright 2024 alexx, MIT License
# RDFa:deps="[minify]"
usage(){ printf "Usage: %s [-h]\n\t -h This help message\n" "$(basename $0)";
exit 0;}
[ "$1" ]&& echo "$1"|grep -q '\-h' && usage
# creates main.min.js from main.js
# also acts as a sanity check to verify that your code can at least be parsed.

# strip the logging and shorten string name(s)
sed 's,console.log(.*);,,g;s/current_page/tp/g' js/main.js > /tmp/clean_main.js
# minify js/main.js > js/main.min.js
minify /tmp/clean_main.js > js/main.min.js

