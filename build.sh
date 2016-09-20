#!/bin/bash
#
# Remove any previous archives
rm -f lamda_authorizer-*.zip

# Run tests
npm test
if [ ! $? == 0 ]; then
    exit 1
fi

# Clean and npm install for current deps
rm -rf node_modules
npm install --production

# Build version number
VERSION="$1"
if [ -z "$BUILD_NUMBER" ]; then
    RELEASE_VERSION="${VERSION}.0"
else
    RELEASE_VERSION="${VERSION}.${BUILD_NUMBER}"
fi

# Create archive with node.js module
ARCHIVE_NAME="lamda_authorizer-${RELEASE_VERSION}.zip"
zip -r $ARCHIVE_NAME *.js lib/*.js node_modules/*

# Reinstall all the deps for development to continue
npm install
