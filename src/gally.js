const fs = require('fs');
const path = require('path');
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

  if (credentials.bearer === undefined) {
    credentials.bearer = (await inquirer.prompt([{
      type: 'password',
      message: 'Enter github personal access token',
      name: 'bearer',
      mask: '*'
    }])).bearer;
  }

  json.write(configFile, config);
  json.write(credentialsFile, credentials);

  return {
    config,
    credentials
  };
};
