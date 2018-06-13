#!/usr/bin/env bash

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
SCRIPTDIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
# echo ${SCRIPTDIR} # For debugging

which node > /dev/null
if [ ! $? -eq 0 ]
then
    echo "You must install Node.js to run this."
    echo "See https://nodejs.org/"
    exit 1
fi

cd ${SCRIPTDIR}/Station

if [ ! -d "node_modules" ]; then
  npm install
fi

node index.js

cd ${SCRIPTDIR}
