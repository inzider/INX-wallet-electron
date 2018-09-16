(function () {

  var app = angular.module("app", [
    "ngRoute",
    "ngTouch",
    "ngAnimate"
  ]);

  app.config(function ($routeProvider) {

    $routeProvider

      .when("/", {
        controller: "balancePageCtrl",
        templateUrl: "pages/balance.html",
        activeTab: "balance"
      })

      .when("/send", {
        controller: "sendPageCtrl",
        templateUrl: "pages/send.html",
        activeTab: "send"
      })
    
      .when("/transactions", {
        controller: "transactionsPageCtrl",
        templateUrl: "pages/transactions.html",
        activeTab: "transactions"
      })
    
      .when("/block-explorer", {
        controller: "blockExplorerPageCtrl",
        templateUrl: "pages/block-explorer.html",
        activeTab: "block-explorer"
      })
    
      .when("/my-contacts", {
        controller: "myContactsPageCtrl",
        templateUrl: "pages/my-contacts.html",
        activeTab: "my-contacts"
      })
    
      .when("/pool-mining", {
        controller: "poolMiningPageCtrl",
        templateUrl: "pages/pool-mining.html",
        activeTab: "pool-mining"
      })

      .otherwise({
        redirectTo: "/"
      });

  });

  app.run(function ($rootScope, Daemon) {

    $rootScope.$on("config:ready", function ($event) {
      Daemon.run();
    });

  });

})();
