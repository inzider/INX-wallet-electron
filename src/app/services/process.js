(function () {

  var homedir = require("os").homedir();
  var DaemonWrapper = require("inx-daemon-nodejs-wrapper");
  var WalletWrapper = require("inx-wallet-nodejs-wrapper");

  var app = angular.module("app");

  app.factory("Process", function ($rootScope, System) {

    // baseConfig
    var baseConfig = {
      configFile: 'INX.conf',
      rootDir: homedir + '/.inx-wallet/'
    };

    return {
      // getSystemConfig
      getSystemConfig: function () {
        return {
          configFile: baseConfig.configFile,
          rootDir: baseConfig.rootDir,
          buildsDir: baseConfig.rootDir + 'builds/',
          dataDir: baseConfig.rootDir + 'data/',
          logsDir: baseConfig.rootDir + 'logs/',
          tempDir: baseConfig.rootDir + 'temp/',
          walletDir: baseConfig.rootDir + 'wallets/'
        };
      },

      // getDaemonConfig
      getDaemonConfig: function () {
        var systemConfig = this.getSystemConfig();
        return {
          path: systemConfig.buildsDir + 'INXd',
          logDir: systemConfig.logsDir + 'daemon.log',
          configFile: baseConfig.rootDir + baseConfig.configFile,
          dataDir: systemConfig.dataDir,
          enableWebSocket: false
        };
      },

      // getWalletConfig
      getWalletConfig: function () {
        var systemConfig = this.getSystemConfig();
        return {
          config: baseConfig.rootDir + baseConfig.configFile,
          containerFile: systemConfig.walletDir + 'container.wallet',
          containerPassword: 'container',
          daemonRpcAddress: '127.0.0.1',
          daemonRpcPort: 44441,
          bindAddress: '127.0.0.1',
          bindPort: 44446
        };
      },

      // initDaemonProcess
      initDaemonProcess: function (overrideDaemonConfig) {
        return new DaemonWrapper(this.getDaemonConfig(overrideDaemonConfig));
      },

      // initWalletProcess
      initWalletProcess: function (overrideWalletConfig) {
        return new WalletWrapper(this.getWalletConfig(overrideWalletConfig));
      },
    }
  });

})();
