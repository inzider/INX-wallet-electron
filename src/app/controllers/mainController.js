(function () {
  
  var app = angular.module("app");
  
  app.controller("mainCtrl", function ($scope, $route) {
    $scope.$route = $route;
    
    $scope.countUnseenTransactions = function () {
      return 44;
    };
  });
  
})();
