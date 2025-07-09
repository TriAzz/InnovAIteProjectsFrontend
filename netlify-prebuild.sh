#!/bin/bash
# This script runs before the build to ensure CI=false
export CI=false
echo "CI environment variable set to: $CI"
