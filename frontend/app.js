(function () {
  'use strict';

  angular
    .module('App', [
      'templates',
      'ui.router',

      'App.module.menu',
      'App.module.index'
    ])
    .config(Config)
    .run(Run)
    .controller('ApplicationCtrl', ApplicationCtrl);

  Config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Config($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        url: "",
        abstract: true,
        templateUrl: "modules/menu/menu.html",
        controller: 'MenuCtrl as rMenu'
      })
      .state('app.index', {
        url: "/",
        templateUrl: "modules/index/index.html",
        controller: 'IndexCtrl as rIndex'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
  }

  Run.$inject = ['$rootScope'];

  function Run($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function () {
      $("html, body").animate({scrollTop: 0}, 200);
    });
  }

  function ApplicationCtrl() {}
})();
