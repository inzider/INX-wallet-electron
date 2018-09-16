(function () {

  var app = angular.module("app");

  app.factory("Daemon", function ($rootScope, Process) {
    var daemon = Process.initDaemonProcess();
    
    $rootScope.blockchain = {
      height: 0,
      network_height: 0,
      difficulty: 0,
      globalHashRate: 0
    };
    $rootScope.$apply();
    
    return {
      on: function (eventName, callback) {
        if (daemon) daemon.on(eventName, callback);
      },
      
      run: function () {
        Process.startDaemon(daemon);
      }
    }
  });

})();
