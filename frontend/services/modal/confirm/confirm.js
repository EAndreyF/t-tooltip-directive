angular.module('App.service.modal.confirm', [])
    .controller('ModalConfirmCtrl', function ($scope) {

      var model = {
        ok: function () {
          return $scope.confirm.result.resolve();
        },
        cancel: function () {
          return $scope.confirm.result.reject();
        },
        buttonOk: function () {
          return $scope.confirm.ok;
        },
        buttonCancel: function () {
          return $scope.confirm.cancel;
        },
        title: function () {
          return $scope.confirm.title;
        }
      };

      $scope.rConfirm = model;
    });