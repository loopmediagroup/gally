const fs = require('fs');
const path = require('path');
const get = require("lodash.get");
const set = require("lodash.set");
const inquirer = require('inquirer');
const json = require("./util/json");

module.exports.load = async (configDir) => {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  const configFile = path.join(configDir, "config");
  const credentialsFile = path.join(configDir, "credentials");

  const config = json.loadOrDefault(configFile);
  const credentials = json.loadOrDefault(credentialsFile);

  if (get(credentials, "github.username") === undefined) {
    set(credentials, "github.username", await inquirer.prompt([{
      type: 'input',
      message: 'Enter github username',
      name: 'username'
    }]).username)
  }

  if (get(credentials, "github.token") === undefined) {
    set(credentials, "github.token", await inquirer.prompt([{
      type: 'password',
      message: 'Enter github personal access token',
      name: 'token',
      mask: '*'
    }]).token);
  }

  json.write(configFile, config);
  json.write(credentialsFile, credentials);

  return {
    config,
    credentials
  };
};
