(function () {

  var app = angular.module("app");

  app.factory("Wallet", function ($rootScope, Process) {
    var wallet = Process.initDaemonProcess();
    
    $rootScope.wallet = {
      address: "",
      balance: 0,
      lockedBalance: 0,
      transactions: []
    };
    $rootScope.$apply();
    
    return {
      on: function (eventName, callback) {
        if (wallet) wallet.on(eventName, callback);
      },
      
      run: function () {
        Process.startDaemon(wallet);
      }
    }
  });

})();
