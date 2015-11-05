angular.module('App.directive.cards', [
    'App.model.cards'
])

  .directive('rsCards', function(Cards) {
    return {
      restrict: 'C',
      templateUrl: 'directives/cards/cards.html',
      controller: function ($scope, $state) {
        var model = {
          getCards: function () {
            return Cards.getCards()
          }
        };
        $scope.rCards = model;
      }
    };
  });