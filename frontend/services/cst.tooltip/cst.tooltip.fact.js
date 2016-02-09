(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .factory('cstTooltipFct', TooltipFct);

  TooltipFct.$inject = ['cstTooltipHelpFct'];

  function TooltipFct(cstTooltipHelpFct) {
    var id = 0;

    return {
      _tooltips: [],
      getAllTooltips: getAllTooltips,
      addTooltip: addTooltip,
      removeTooltip: removeTooltip,
      recalc: recalc,
      _hasTooltip: _hasTooltip,
      _createTooltip: _createTooltip,
      _sizeVisCalculate: _sizeVisCalculate,
      _sort: _sort
    };

    /**
     * Retrun all visible tooltips
     * @returns {Array}
     */
    function getAllTooltips() {
      return this._tooltips.filter(function (el) {
        return el.canvas.visibility;
      });
    }

    /**
     * Add tooltip to current element.
     * If element has tooltip, don't add
     * @param element
     * @returns {boolean}
     */
    function addTooltip(element) {
      if (!this._hasTooltip(element)) {
        console.log('add tooltip', element);
        this._createTooltip(element);
        return true;
      } else {
        console.log('tooltip exists');
        return false;
      }
    }

    function removeTooltip(id) {
      this._tooltips = this._tooltips.filter(function(el) {
        return el.id !== id;
      });
    }

    /**
     * Check that current element has tooltip
     * @param element
     * @returns {boolean}
     * @private
     */
    function _hasTooltip(element) {
      var alreadyAdded = this._tooltips.some(function (el) {
        return el.element === element;
      });
      var selfTooltip = $(element).parents('.cst-tooltip').length;
      return alreadyAdded || !!selfTooltip;
    }

    /**
     * Create new tooltip
     * @param element
     * @private
     */
    function _createTooltip(element) {
      this._tooltips.push({
        id: id++,
        element: element,
        $element: $(element),
        centerx: 0,
        centery: 0,
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        icon: {}, // styles for icon
        canvas: {
          visibility: true
        } // styles for canvas
      });
    }

    /**
     * Calculate tooltip positions
     */
    function recalc() {
      this._sizeVisCalculate();
      this._sort();
      cstTooltipHelpFct.placeInBoard(this.getAllTooltips());
    }

    /**
     * Get visual params for element
     * @private
     */
    function _sizeVisCalculate() {
      this._tooltips.forEach(function (el) {
        var offset = el.$element.offset();

        el.width = el.$element.outerWidth();
        el.height = el.$element.outerHeight();
        el.left = offset.left;
        el.top = offset.top;
        el.centerx = el.left + el.width / 2;
        el.centery = el.top + el.height / 2;
        el.canvas.visibility = el.$element.is(':visible');
      });
    }


    /**
     * Sort tooltip. First in top left corner
     * @private
     */
    function _sort() {
      this._tooltips.sort(function (a, b) {
        var acy = a.centery;
        var acx = a.centerx;
        var bcy = b.centery;
        var bcx = b.centerx;
        var m = -1;
        if (acy < bcy) {
          return m;
        }
        if (acy > bcy) {
          return -1 * m;
        }
        if (acx < bcx) {
          return m;
        }
        if (acx > bcx) {
          return -1 * m;
        }
        return 0;
      });
    }
  }
})();
