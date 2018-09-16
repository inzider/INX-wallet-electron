(function () {

  var fs = require("fs");
  var dns = require("dns");
  var http = require("http");
  var https = require("https");
  var electron = require("electron");
  var homedir = require("os").homedir();

  var app = angular.module("app");

  app.factory("System", function () {

    return {

      // isConnectedToInternet
      isConnectedToInternet: function () {
        return navigator.onLine;
      },

      // hasConfigFile
      hasConfigFile: function (configFile) {
        return fs.existsSync(configFile);
      },

      // downloadLatestConfig
      downloadLatestConfig: function (configFile, callback) {
        console.log("Downloading config file: " + configFile);
        var file = fs.createWriteStream(configFile);
        var request = https.get("https://raw.githubusercontent.com/InziderX/INX-config/master/INX.conf", function (response) {
          response.pipe(file);
          file.on('finish', function () {
            file.close();
            callback();
          });
        }).on('error', function (err) {
          //fs.unlink(configFile);
        });
      },

      // prepareDirectories
      prepareDirectories: function (systemConfig) {
        if (!fs.existsSync(systemConfig.rootDir))
          fs.mkdirSync(systemConfig.rootDir);

        if (!fs.existsSync(systemConfig.dataDir))
          fs.mkdirSync(systemConfig.dataDir);

        if (!fs.existsSync(systemConfig.logsDir))
          fs.mkdirSync(systemConfig.logsDir);

        if (!fs.existsSync(systemConfig.buildsDir))
          fs.mkdirSync(systemConfig.buildsDir);

        if (!fs.existsSync(systemConfig.tempDir))
          fs.mkdirSync(systemConfig.tempDir);

        if (!fs.existsSync(systemConfig.walletDir))
          fs.mkdirSync(systemConfig.walletDir);
      },

      // deleteDatabase
      deleteDatabase: function (dataPath) {
        fs.unlinkSync(dataPath + "/DB/LOCK");
      },

      // isDatabaseLocked
      isDatabaseLocked: function (dataPath) {
        return fs.existsSync(dataPath + "/DB/LOCK");
      },

      // removeDatabaseLock
      removeDatabaseLock: function (dataPath) {
        if (fs.existsSync(dataPath + "/DB/LOCK")) {
          console.log("Removing existing LOCK file...");
          fs.unlinkSync(dataPath + "/DB/LOCK");
        }
      }

    }
  });

})();
