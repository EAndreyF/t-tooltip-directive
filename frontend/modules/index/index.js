(function () {
  'use strict';

  angular
    .module('App.module.index', [
      'cst.tooltip'
    ])
    .controller('IndexCtrl', IndexCtrl);

  IndexCtrl.$inject = [];

  function IndexCtrl() {
    var vm = this;
  }
})();
