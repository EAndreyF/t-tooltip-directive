angular.module('App.module.index', [
    'App.directive.cards',
    'App.model.cards'
])

  .controller('IndexCtrl', function ($scope, Cards) {

    var model = {
      add: function () {
        Cards.addCard({text: model.value});
        model.value = '';
      },
      value: ''
    };

    $scope.rIndex = model;
  });