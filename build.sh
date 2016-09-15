#!/bin/bash
#
# Clean and npm install for current deps
rm -rf node_modules
npm install

# Build version number
VERSION="$1"
if [ -z "$BUILD_NUMBER" ]; then
    RELEASE_VERSION="${VERSION}.0"
else
    RELEASE_VERSION="${VERSION}.${BUILD_NUMBER}"
fi

# Create archive with node.js module
ARCHIVE_NAME="lamda_authorizer-${RELEASE_VERSION}.zip"
zip $ARCHIVE_NAME *.js lib/*.js node_modules
