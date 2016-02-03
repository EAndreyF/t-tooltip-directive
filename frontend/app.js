(function () {
  'use strict';

  angular
    .module('App', [
      'ui.router',
      'templates',

      'App.module.menu',
      'App.module.index'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {

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

    })
    .run(function ($state, $rootScope) {
      $rootScope.$on('$stateChangeSuccess', function () {
        $("html, body").animate({scrollTop: 0}, 200);
      });
    })
    .controller('ApplicationCtrl', ApplicationCtrl);

  function ApplicationCtrl() {}
})();
