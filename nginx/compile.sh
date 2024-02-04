#!/bin/bash

# TODO: .env.development and .env.production.
export TEST=hi

# source envs
if [ -f ".env" ]; then
    source ".env"
fi

if [ -f ".env.local" ]; then
    source ".env.local"
fi

# compile erb
if [ ! -d "build" ]; then
  mkdir -p "build"
fi

find conf -name '*.erb' -exec sh -c 'erb "$0" > build/"$(basename "$0" .erb)"' {} \;