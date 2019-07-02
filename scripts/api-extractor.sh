#!/usr/bin/env bash
set -e


npm i -g @microsoft/api-extractor

# Assets
cp ./api/api-extractor-assets.json ./dist/assets/api-extractor.json
(
  cd ./dist/assets && \
  api-extractor run --local --verbose
)

# Core
# cp ./api/api-extractor-core.json ./dist/core/api-extractor.json
# (
#   cd ./dist/core && \
#   api-extractor run --local --verbose
# )

# Storefrontlib
cp ./api/api-extractor-storefrontlib.json ./dist/storefrontlib/api-extractor.json
(
  cd ./dist/storefrontlib && \
  api-extractor run --local --verbose
)
