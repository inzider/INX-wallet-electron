(function () {

  var app = angular.module("app");

  app.factory("Daemon", function ($rootScope, $window, System, Process) {
    var daemon = Process.initDaemonProcess();

    var systemConfig = Process.getSystemConfig();
    var daemonConfig = Process.getDaemonConfig();

    $rootScope.blockchain = {};
    $rootScope.$apply();

    System.prepareDirectories(systemConfig);

    if (System.isConnectedToInternet()) {
      $rootScope.networkStatus = "Online";
      $rootScope.$apply();
      
      console.log("Connection to internet available!");

      if (!System.hasConfigFile(systemConfig.rootDir + systemConfig.configFile)) {
        console.log("No config file has been found, starting download from git repository...");

        System.downloadLatestConfig(systemConfig.rootDir + systemConfig.configFile, function () {
          console.log("Config file is ready!");
          runDaemon();
        });
      } else {
        console.log("Config file found and ready!");
        runDaemon();
      }
    } else {
      $rootScope.networkStatus = "Offline";
      $rootScope.$apply();
      
      if (System.hasConfigFile(systemConfig.rootDir + systemConfig.configFile)) {
        console.log("Config file found and ready!");
        runDaemon();
      } else {
        console.log("Config file not found and offline!");
      }
    }

    $window.addEventListener("online", function () {
      $rootScope.$broadcast("network:online");
    });

    $window.addEventListener("offline", function () {
      $rootScope.$broadcast("network:offline");
    });

    function runDaemon() {
      if (System.isDatabaseLocked(daemon.dataDir)) {
        System.removeDatabaseLock(daemon.dataDir);
      }

      // start
      daemon.on('start', function (args) {
        console.log('Daemon has started... ' + args);
      });

      // started
      daemon.on('started', function () {
        $rootScope.syncState = "started";
        $rootScope.syncPercent = "0";
        $rootScope.peerCount = "0";
        $rootScope.peerCountTotal = "0";
        $rootScope.blockchain.tx_count = "0";
        $rootScope.$apply();

        console.log('Daemon is attempting to synchronize with the network...')
      });

      // syncing
      daemon.on('syncing', function (info) {
        $rootScope.syncState = "syncing";
        $rootScope.syncPercent = info.percent;
        $rootScope.blockchain.height = info.height;
        $rootScope.blockchain.network_height = info.network_height;
        $rootScope.$apply();

        console.log('Daemon has syncronized ' + info.height + '/' + info.network_height + ' blocks [' + info.percent + '%]');
      });

      // synced
      daemon.on('synced', function () {
        $rootScope.syncState = "synced";
        $rootScope.syncPercent = "100";
        $rootScope.$apply();

        console.log('Daemon is synchronized with the network...')
      });

      // getInfo
      daemon.on('getInfo', function (info) {
        $rootScope.syncPercent = info.percent;
        $rootScope.peerCount = info.white_peerlist_size;
        $rootScope.peerCountTotal = (info.white_peerlist_size + info.grey_peerlist_size);
        $rootScope.blockchain.height = info.height;
        $rootScope.blockchain.network_height = info.network_height;
        $rootScope.blockchain.tx_count = info.tx_count;
        $rootScope.blockchain.difficulty = info.difficulty;
        $rootScope.blockchain.globalHashRate = info.hashrate;
        $rootScope.$apply();
      });

      // ready
      daemon.on('ready', function (info) {
        $rootScope.blockchain.height = info.height;
        $rootScope.blockchain.difficulty = info.difficulty;
        $rootScope.blockchain.globalHashRate = info.globalHashRate;
        $rootScope.$apply();

        console.log('Daemon is waiting for connections at ' + info.height + ' @ ' + info.difficulty + ' - ' + info.globalHashRate + ' H/s');
      });

      // desync
      daemon.on('desync', function (daemon, network, deviance) {
        $rootScope.syncState = "desync";
        $rootScope.$apply();

        console.log('Daemon is currently off the blockchain by ' + deviance + ' blocks. Network: ' + network + '  Daemon: ' + daemon);
      });

      // down
      daemon.on('down', function () {
        $rootScope.syncState = "down";
        $rootScope.$apply();

        console.log('Daemon is not responding... stopping process...')
      });

      // stopped
      daemon.on('stopped', function (exitcode) {
        $rootScope.syncState = "stopped";
        $rootScope.$apply();

        console.log('Daemon has closed (exitcode: ' + exitcode + ')... restarting process...')
      });

      // info
      daemon.on('info', function (info) {
        console.log(info);
      });

      // error
      daemon.on('error', function (err) {
        console.log(err);
      });

      try {
        daemon.start();
      } catch (ex) {
        console.log(ex);
      }
    }

    return {
      emit: function (eventName, eventData) {
        daemon.emit(eventName, eventData);
      },

      on: function (eventName, callback) {
        daemon.on(eventName, callback);
      },

      run: function () {
        runDaemon();
      },

      stop: function () {
        daemon.stop();
      }
    }
  });

})();
