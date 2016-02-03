(function () {
  'use strict';

  angular
    .module('App.directive.cards', [
      'App.model.cards'
    ])
    .directive('rsCards', rsCardsDirective);

  function rsCardsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'directives/cards/cards.html',
      controller: CardsCtrl,
      controllerAs: 'rCards'
    };
  }

  CardsCtrl.$inject = ['Cards'];

  function CardsCtrl(Cards) {
    var vm = this;
    vm.getCards = getCards;

    function getCards() {
      return Cards.getCards()
    }
  }

})();
