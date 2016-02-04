(function () {
  'use strict';

  angular
    .module('App.service.modal', [
      'App.service.modal.confirm',
      'ui.bootstrap'
    ])
    .factory('Modal', Modal);


  Modal.$inject = ['$rootScope', '$uibModal'];

  function Modal($rootScope, $uibModal) {
    return {
      dialog: null,
      close: close,
      open: open,
      confirm: confirm
    };

    function close() {
      this.dialog && this.dialog.close();
    }

    function open(options) {
      return this.dialog = $uibModal.open(options);
    }

    function confirm(options) {
      options = angular.extend({
        title: 'Confirm action',
        ok: 'OK',
        cancel: 'Cancel'
      }, options);

      var scope = $rootScope.$new();
      scope.confirm = {
        title: options.title,
        ok: options.ok,
        cancel: options.cancel
      };

      return this.open({
        scope: scope,
        templateUrl: 'services/modal/confirm/confirm.html',
        controller: 'ModalConfirmCtrl',
        controllerAs: 'rConfirm',
        bindToController: true
      });
    }
  }

})();
