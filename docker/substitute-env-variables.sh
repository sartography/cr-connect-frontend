#!/bin/bash

echo 'Substituting environment variables...'

# The first parameter is a comma-delimited list of paths to files which should be substituted
if [[ -z $1 ]]; then
  echo 'ERROR: No target files given.'
  exit 1
fi

env_list='\$PRODUCTION \$API_URL \$IRB_URL \$HOME_ROUTE \$PORT0'
for i in $(echo $1 | sed "s/,/ /g")
do
  echo "replacing $env_list in $i"

  # Replace strings in the given file(s) in env_list
  envsubst "$env_list" < "$i" > "$i".tmp && mv "$i".tmp "$i"

  echo "..."

  # Set DEBUG=true in order to log the replaced file
  if [ "$DEBUG" = true ] ; then
    exec cat $i
  fi
done

echo 'Finished substituting environment variables.'

# Execute all other commands with parameters
exec "${@:2}"
