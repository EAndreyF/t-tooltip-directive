(function () {
  'use strict';

  angular
    .module('App.service.modal.confirm', [])
    .controller('ModalConfirmCtrl', ModalConfirmCtrl);

  function ModalConfirmCtrl() {
    var vm = this;
    vm.ok = ok;
    vm.cancel = cancel;
    vm.buttonOk = buttonOk;
    vm.buttonCancel = buttonCancel;
    vm.title = title;

    function ok() {
      return this.$close();
    }

    function cancel() {
      return this.$dismiss();
    }

    function buttonOk() {
      return this.confirm.ok;
    }

    function buttonCancel() {
      return this.confirm.cancel;
    }

    function title() {
      return this.confirm.title;
    }
  }

})();
