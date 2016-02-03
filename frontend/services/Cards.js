(function () {
  'use strict';

  angular
    .module('App.model.cards', [])
    .factory('Cards', Cards);

  function Cards() {
    return {
      cards: [],
      addCard: addCard,
      getCards: getCards
    };

    function addCard(card) {
      this.cards.push(card);
    }

    function getCards() {
      return this.cards;
    }
  }
})();
