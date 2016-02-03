(function () {
  'use strict';

  angular
    .module('App.module.index', [
      'App.directive.cards',
      'App.model.cards',
      'App.service.modal'
    ])
    .controller('IndexCtrl', IndexCtrl);

  IndexCtrl.$inject = ['Cards', 'Modal'];

  function IndexCtrl(Cards, Modal) {
    var vm = this;
    vm.add = add;
    vm.value = '';

    Modal.confirm();

    function add() {
      Cards.addCard({text: vm.value});
      vm.value = '';
    }
  }
})();
