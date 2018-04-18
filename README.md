# Gally aka Git-Ally

[![Build Status](https://img.shields.io/travis/loopmediagroup/gally/master.svg)](https://travis-ci.org/loopmediagroup/gally)
[![Test Coverage](https://img.shields.io/coveralls/loopmediagroup/gally/master.svg)](https://coveralls.io/github/loopmediagroup/gally?branch=master)
[![Greenkeeper Badge](https://badges.greenkeeper.io/loopmediagroup/gally.svg)](https://greenkeeper.io/)
[![Dependencies](https://david-dm.org/loopmediagroup/gally/status.svg)](https://david-dm.org/loopmediagroup/gally)
[![NPM](https://img.shields.io/npm/v/gally.svg)](https://www.npmjs.com/package/gally)
[![Downloads](https://img.shields.io/npm/dt/gally.svg)](https://www.npmjs.com/package/gally)
[![Semantic-Release](https://github.com/simlu/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)
[![Gitter](https://github.com/simlu/js-gardener/blob/master/assets/icons/gitter.svg)](https://gitter.im/loopmediagroup/gally)

Git-Ally - Automation around Github.com Repository Management

## Install

    $ npm i -g gally

## Commands

All commands are available as `ga` or `gally`.

### pr [branch]

Create PR from `origin/CURRNET_BRANCH` to remote `upstream/TARGET_BRANCH` with

    $ ga pr [branch]

where `branch` is the target branch (defaults to dev).
