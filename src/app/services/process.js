(function () {

  var homedir = require("os").homedir();
  var DaemonWrapper = require("inx-daemon-nodejs-wrapper");
  var WalletWrapper = require("inx-wallet-nodejs-wrapper");

  var app = angular.module("app");

  app.factory("Process", function ($rootScope, System) {
    
    var systemConfig = {
      configFile: 'INX.conf',
      rootDir: homedir + '/.inx-wallet/'
    };
    systemConfig.buildsDir = systemConfig.rootDir + 'builds/';
    systemConfig.dataDir = systemConfig.rootDir + 'data/';
    systemConfig.logsDir = systemConfig.rootDir + 'logs/';
    systemConfig.tempDir = systemConfig.rootDir + 'temp/';
    systemConfig.walletDir = systemConfig.rootDir + 'wallets/';

    var defaultDaemonConfig = {
      path: systemConfig.buildsDir + 'INXd',
      logDir: systemConfig.logsDir + 'daemon.log',
      configFile: systemConfig.rootDir + systemConfig.configFile,
      dataDir: systemConfig.dataDir,
      enableWebSocket: false
    };

    var defaultWalletConfig = {
      config: systemConfig.rootDir + systemConfig.configFile,
      containerFile: systemConfig.walletDir + 'container.wallet',
      containerPassword: 'container',
      daemonRpcAddress: '127.0.0.1',
      daemonRpcPort: 44441,
      bindAddress: '127.0.0.1',
      bindPort: 44446
    };

    System.prepareDirectories(systemConfig);

    System.downloadLatestConfig(systemConfig.rootDir + systemConfig.configFile, function () {
      $rootScope.$broadcast("config:ready");
    });

    return {
      initDaemonProcess: function (daemonConfig) {
        return new DaemonWrapper(defaultDaemonConfig);
      },

      initWalletProcess: function (walletConfig) {
        return new WalletWrapper(defaultWalletConfig);
      },

      startDaemon: function (daemonWrapper) {
        if (System.isDatabaseLocked(daemonWrapper.dataDir)) {
          System.removeDatabaseLock(daemonWrapper.dataDir);
          $rootScope.$broadcast('db_unlocking');
        }
        try {
          // start
          daemonWrapper.on('start', function (args) {
            $rootScope.$broadcast('start', args);

            console.log('Daemon has started... ' + args);
          });

          // started
          daemonWrapper.on('started', function () {
            $rootScope.$broadcast('started');
            $rootScope.syncState = "started";
            $rootScope.syncState = "synced";
            $rootScope.syncPercent = "0";
            $rootScope.$apply();

            console.log('Daemon is attempting to synchronize with the network...')
          });

          // syncing
          daemonWrapper.on('syncing', function (info) {
            $rootScope.$broadcast('syncing', info);
            $rootScope.syncState = "syncing";
            $rootScope.syncPercent = info.percent;
            $rootScope.blockchain.height = info.height;
            $rootScope.blockchain.network_height = info.network_height;
            $rootScope.$apply();

            console.log('Daemon has syncronized ' + info.height + '/' + info.network_height + ' blocks [' + info.percent + '%]');
          });

          // synced
          daemonWrapper.on('synced', function () {
            $rootScope.$broadcast('synced');
            $rootScope.syncState = "synced";
            $rootScope.syncPercent = "100";
            $rootScope.$apply();

            console.log('Daemon is synchronized with the network...')
          });

          // getInfo
          daemonWrapper.on('getInfo', function (info) {
            console.log(info);
            $rootScope.$broadcast('getInfo', info);
            $rootScope.syncPercent = info.percent;
            $rootScope.peerCount = info.white_peerlist_size;
            $rootScope.blockchain.height = info.height;
            $rootScope.blockchain.network_height = info.network_height;
            $rootScope.blockchain.tx_count = info.tx_count;
            $rootScope.$apply();
          });
          
          // ready
          daemonWrapper.on('ready', function (info) {
            $rootScope.$broadcast('ready', info);
            $rootScope.blockchain.height = info.height;
            $rootScope.blockchain.difficulty = info.difficulty;
            $rootScope.blockchain.globalHashRate = info.globalHashRate;
            $rootScope.$apply();

            console.log('Daemon is waiting for connections at ' + info.height + ' @ ' + info.difficulty + ' - ' + info.globalHashRate + ' H/s');
          });

          // desync
          daemonWrapper.on('desync', function (daemon, network, deviance) {
            $rootScope.$broadcast('desync', daemon, network, deviance);
            $rootScope.syncState = "desync";
            $rootScope.$apply();

            console.log('Daemon is currently off the blockchain by ' + deviance + ' blocks. Network: ' + network + '  Daemon: ' + daemon);
          });

          // down
          daemonWrapper.on('down', function () {
            $rootScope.$broadcast('down');
            $rootScope.syncState = "down";
            $rootScope.$apply();

            console.log('Daemon is not responding... stopping process...')
          });

          // stopped
          daemonWrapper.on('stopped', function (exitcode) {
            $rootScope.$broadcast('stopped', exitcode);
            $rootScope.syncState = "stopped";
            $rootScope.$apply();

            console.log('Daemon has closed (exitcode: ' + exitcode + ')... restarting process...')
          });

          // info
          daemonWrapper.on('info', function (info) {
            $rootScope.$broadcast('info', info);
            console.log(info);
          });

          // error
          daemonWrapper.on('error', function (err) {
            $rootScope.$broadcast('error', err);
            console.log(err);
          });

          daemonWrapper.start();
        } catch (ex) {
          console.log(ex);
        }
      },

      startWallet: function (walletWrapper) {
        walletWrapper.start();
      }
    }
  });

})();
