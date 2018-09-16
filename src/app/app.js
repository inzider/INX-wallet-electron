(function () {

  var app = angular.module("app", [
    "ngRoute",
    "ngTouch",
    "ngAnimate"
  ]);

  app.config(function ($routeProvider) {

    $routeProvider

      .when("/", {
        controller: "indexCtrl",
        templateUrl: "pages/index.html"
      })

      .when("/wallet", {
        controller: "walletCtrl",
        templateUrl: "pages/wallet.html"
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
