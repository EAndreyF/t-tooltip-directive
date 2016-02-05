(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .factory('cstTooltipFct', TooltipFct);

  function TooltipFct() {
    var tooltips = [];

    return {
      getAllTooltips: getAllTooltips,
      addTooltip: addTooltip,
      _hasTooltip: _hasTooltip,
      _createTooltip: _createTooltip
    };

    function getAllTooltips() {
      return tooltips;
    }

    function addTooltip(element) {
      if (!this._hasTooltip(element)) {
        console.log('add tooltip', event.target);
        this._createTooltip(element);
      } else {
        console.log('tooltip exists');
      }
    }

    function _hasTooltip(element) {
      return tooltips.some(function (el) {
        return el === element;
      });
    }

    function _createTooltip(element) {
      tooltips.push(element);
    }
  }
})();
