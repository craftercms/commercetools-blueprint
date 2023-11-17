#!/usr/bin/env bash

echo "Making sure all deps are met"
yarn

echo "Deleting prior build"
rm -rf ../../static-assets/app/*

echo "Running react build"
yarn build-vite

echo "Restoring .gitkeep"
touch ../../static-assets/app/.gitkeep

git add ../../static-assets/app

echo "Build finished"
