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

## Github Credentials

You will be prompted to enter a personal github token that will then be stored as plain text on disk.

If an environment variable `GH_TOKEN` is present, no prompt is displayed and the variable is stored directly.

## Contents of `.gally.json`

To create a config template run `ga init`. The configuration is an object with the following top level keys.

### defaultBranch

Type: `object`<br>
The default branch for the github repository.

### repository.url

Type: `string`<br>
The main github repository of this project.

### protection

Type: `object`<br>
Define protection definition as entries in the object. Key names can be freely chosen, values have to be defined according to the [github api docs](https://developer.github.com/v3/repos/branches/#update-branch-protection). Can use `"@"` key to extend from other protections.

### branches

Type: `object`<br>
Define branch names as keys in this object, mapping to their configuration. 

Configurations are objects with the following keys: `protection (string)` needs to reference a protection in the protection object, or null if not protection is desired, `create (boolean)` will determine if the branch should be created if not found in the repository. New branches are created using the default branch as a base.

You can define prefix matching by appending a star to the name. Prefix matching currently only supports an empty configuration.

## Cli Commands

All commands are available as `ga` or `gally`.

### pr [branch]

Open PR Url from `origin/CURRNET_BRANCH` to remote `upstream/TARGET_BRANCH` with

    $ ga pr [branch]

where `branch` is the target branch (defaults to dev).

### promote [remote] \<branch\>

Create PR from `upstream/INPUT_BRANCH` to "upstream" branch `upstream/BRANCH` with

    $ ga promote <branch>

where the upstream branch is defined in the configuration file under "upstream".

You can define a custom remote if so desired.

### init

Create a new `.gally.json` file by running

    $ ga init

For details on how to adjust the configuration, see the corresponding section.

### sync [remote]

Synchronize config `.gally.json` to remote github repository defined in config or using remote if passed.
