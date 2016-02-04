(function () {
  'use strict';

  angular
    .module('App.module.index', [
      'App.directive.cards',
      'App.model.cards',
      'App.service.modal',
      'App.service.spinner'
    ])
    .controller('IndexCtrl', IndexCtrl);

  IndexCtrl.$inject = ['Cards', 'Modal', 'Spinner'];

  function IndexCtrl(Cards, Modal, Spinner) {
    var vm = this;
    vm.add = add;
    vm.value = '';

    Modal.confirm();
    Spinner.show();
    setTimeout(function() { Spinner.hide(); }, 1000);

    function add() {
      Cards.addCard({text: vm.value});
      vm.value = '';
    }
  }
})();
