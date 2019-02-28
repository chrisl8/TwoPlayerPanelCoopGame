#!/usr/bin/env bash

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [[ -h "$SOURCE" ]]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ ${SOURCE} != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
# echo ${SCRIPT_DIR} # For debugging

if [[ -d ${HOME}/.nvm ]]; then
  export NVM_DIR="$HOME/.nvm"
  [[ -s "$NVM_DIR/nvm.sh" ]] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [[ -s "$NVM_DIR/bash_completion" ]] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi

which node > /dev/null
if [[ ! $? -eq 0 ]]
then
    echo "You must install Node.js to run this."
    echo "See https://nodejs.org/"
    exit 1
fi

while test $# -gt 0
do
    case "$1" in
        --service) RUN_AS_SERVICE=true
        ;;
        --update) UPDATE_MODULES=true
        ;;
    *) echo "Invalid argument"
    exit
    ;;
    esac
    shift
done

cd ${SCRIPT_DIR}/Station

if [[ ! -d "node_modules" ]]; then
  npm ci
else
  if test "${UPDATE_MODULES}" == "true"; then
    if [[ -d ${HOME}/.nvm ]]; then
      nvm install --lts
    fi
    npm ci
  fi
fi

if test "${RUN_AS_SERVICE}" == "true"; then
  ${SCRIPT_DIR}/Station/node_modules/pm2/bin/pm2 start ${SCRIPT_DIR}/Station/pm2Config.json
  echo "To see the logs run:"
  echo "${SCRIPT_DIR}/Station/node_modules/pm2/bin/pm2 logs"
  echo "To stop the program run:"
  echo "${SCRIPT_DIR}/Station/node_modules/pm2/bin/pm2 stop Game"
  echo "To restart the game (with new code for example) run:"
  echo "${SCRIPT_DIR}/Station/node_modules/pm2/bin/pm2 restart Game"
else
  node index.js
fi
cd ${SCRIPT_DIR}
