# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.0-beta.1](https://github.com/ModyQyW/vite-plugin-stylelint/compare/v6.0.0-beta.0...v6.0.0-beta.1) (2024-10-19)

**Note:** Version bump only for package vite-plugin-stylelint

## [6.0.0-beta.0](https://github.com/ModyQyW/vite-plugin-stylelint/compare/v5.3.1...v6.0.0-beta.0) (2024-10-14)

### ⚠ BREAKING CHANGES

* remove chokidar, introduce another way to handle imported style files

### Features

* remove chokidar, introduce another way to handle imported style files ([17f3d5d](https://github.com/ModyQyW/vite-plugin-stylelint/commit/17f3d5d9955fd98e28ac36ac70b413b5225903af)) - by @ModyQyW

### Bug Fixes

* fix wrong colorize ([55eb4c3](https://github.com/ModyQyW/vite-plugin-stylelint/commit/55eb4c36e8e439810e4cad9bc5186552cb41fbf1)) - by @ModyQyW
* remove extra parsing ([68906c1](https://github.com/ModyQyW/vite-plugin-stylelint/commit/68906c1be6d4c679f69c16d43af99546f8cc8a8f)) - by @ModyQyW
* stylelintInstance may not be initialized when calling lintFiles in the worker ([2caf01c](https://github.com/ModyQyW/vite-plugin-stylelint/commit/2caf01c21c16e365f5929f0fbf5523af7bf703ac)) - by @ModyQyW
* terminate worker if possible ([acd43ca](https://github.com/ModyQyW/vite-plugin-stylelint/commit/acd43caa49e628468d318679633ca4f73158ac2e)) - by @ModyQyW
