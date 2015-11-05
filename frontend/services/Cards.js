angular.module('App.model.cards', [])

    .factory('Cards', function () {
      var model = {
        cards: [],
        addCard: function (card) {
          model.cards.push(card);
        },
        getCards: function () {
          return model.cards;
        }
      };

      return model
    });