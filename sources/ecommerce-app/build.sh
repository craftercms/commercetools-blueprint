#!/usr/bin/env bash

echo "Making sure all deps are met"
yarn

echo "Running react build"
react-scripts build

echo "Deleting prior build"
rm -rf ../../static-assets/app/*

echo "Restoring .gitkeep"
touch ../../static-assets/app/.gitkeep

echo "Copying app build to static assets"
cp -rf ./build/* ../../static-assets/app/

git add ../../static-assets/app

echo "Delete react build output directory"
rm -rf ./build

echo "Build finished"
