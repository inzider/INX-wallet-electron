(function () {
  
  var app = angular.module("app");
  
  app.controller("mainCtrl", function ($rootScope, $scope, $route, Daemon) {
    $rootScope.$route = $route;
    
    $rootScope.isOnline = function () {
      return (navigator.onLine) ? true : false;
    };
    
    $rootScope.getOnlineState = function () {
      return (navigator.onLine) ? "Online" : "Offline";
    };
    
    $rootScope.$on("network:online", function ($event) {
      console.log("Connection to internet established!");
    });
    
    $rootScope.$on("network:offline", function ($event) {
      console.log("Connection to internet lost...");
    });
    
    $rootScope.countUnseenTransactions = function () {
      return 33;
    };
  });
  
})();
