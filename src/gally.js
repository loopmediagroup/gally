const fs = require('fs');
const path = require('path');
const get = require("lodash.get");
const set = require("lodash.set");
const inquirer = require('inquirer');
const json = require("./util/json");

module.exports.load = async (configDir, cwd) => {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  const globalConfigFile = path.join(configDir, "config");
  const credentialsFile = path.join(configDir, "credentials");

  const globalConfig = json.loadOrDefault(globalConfigFile);
  const credentials = json.loadOrDefault(credentialsFile);

  if (get(credentials, "github.username") === undefined) {
    const username = (await inquirer.prompt([{
      type: 'input',
      message: 'Enter github username',
      name: 'username'
    }])).username;
    set(credentials, "github.username", username);
  }

  if (get(credentials, "github.token") === undefined) {
    const token = (await inquirer.prompt([{
      type: 'password',
      message: 'Enter github personal access token',
      name: 'token',
      mask: '*'
    }])).token;
    set(credentials, "github.token", token);
  }

  json.write(globalConfigFile, globalConfig);
  json.write(credentialsFile, credentials);

  return {
    config: {
      local: json.loadOrDefault(path.join(cwd, ".gally")),
      global: globalConfig
    },
    credentials
  };
};
