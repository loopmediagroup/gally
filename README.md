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

## Contents of `.gally.json`

To create a config template run `ga init`. The configuration is an object with the following top level keys.

### defaultBranch

Type: `object`<br>
The default branch for the github repository.

### protection

Type: `object`<br>
Define protection definition as entries in the object. Key names can be freely chosen, values have to be defined according to the [github api docs](https://developer.github.com/v3/repos/branches/#update-branch-protection).

### branches

Type: `object`<br>
Define branch names as keys in this object, mapping to their configuration. 

Configurations are objects with the following keys: `protection (string)` needs to reference a protection in the protection object, or null if not protection is desired, `create (boolean)` will determine if the branch should be created if not found in the repository. New branches are created using the default branch as a base.

You can define prefix matching by appending a star to the name. Prefix matching currently only supports an empty configuration.

## Cli Commands

All commands are available as `ga` or `gally`.

### pr [branch]

Create PR from `origin/CURRNET_BRANCH` to remote `upstream/TARGET_BRANCH` with

    $ ga pr [branch]

where `branch` is the target branch (defaults to dev).

### init

Create a new `.gally.json` file by running

    $ ga init

For details on how to adjust the configuration, see the corresponding section.

### sync \<upstream\>

Synchronize config `.gally.json` to remote github repository.
