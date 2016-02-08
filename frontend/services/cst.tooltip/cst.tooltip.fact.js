(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .factory('cstTooltipFct', TooltipFct);

  TooltipFct.$inject = ['CANVAS_WIDTH', 'CANVAS_HEIGHT', 'BZ_HEIGHT', 'ICON_WIDTH', 'ICON_HEIGHT'];

  function TooltipFct(CANVAS_WIDTH, CANVAS_HEIGHT, BZ_HEIGHT, ICON_WIDTH, ICON_HEIGHT) {

    return {
      _tooltips: [],
      getAllTooltips: getAllTooltips,
      addTooltip: addTooltip,
      recalc: recalc,
      _hasTooltip: _hasTooltip,
      _createTooltip: _createTooltip,
      _sizeVisCalculate: _sizeVisCalculate,
      _sort: _sort,
      _getIconStyle: _getIconStyle,
      _getCanvasStyle: _getCanvasStyle,
      _checkPointInsidePolygon: _checkPointInsidePolygon
    };

    function getAllTooltips() {
      return this._tooltips.filter(function (el) {
        return el.visibility;
      });
    }

    function addTooltip(element) {
      if (!this._hasTooltip(element)) {
        console.log('add tooltip', event.target);
        this._createTooltip(element);
        this.recalc();
      } else {
        console.log('tooltip exists');
      }
    }

    function _hasTooltip(element) {
      var alreadyAdded = this._tooltips.some(function (el) {
        return el.element === element;
      });
      var selfTooltip = $(element).parents('.cst-tooltip').length;
      return alreadyAdded || !!selfTooltip;
    }

    function _createTooltip(element) {
      this._tooltips.push({
        element: element,
        $element: $(element),
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        visibility: true,
        icon: {}, // styles for icon
        canvas: {} // styles for canvas
      });
    }

    function recalc() {
      var _this = this;

      this._sizeVisCalculate();
      this._sort();
      var poly = [];
      this.getAllTooltips().forEach(function (el) {
        _this._getCanvasStyle(el, el.canvas, poly);
        _this._getIconStyle(el, el.icon);
        poly.push([
          [el.canvas.leftOrg, el.canvas.topOrg],
          [el.canvas.leftOrg + el.canvas.widthOrg, el.canvas.topOrg],
          [el.canvas.leftOrg + el.canvas.widthOrg, el.canvas.topOrg + el.canvas.heightOrg],
          [el.icon.leftOrg + ICON_WIDTH, el.icon.topOrg + ICON_HEIGHT],
          [el.icon.leftOrg, el.icon.topOrg + ICON_HEIGHT],
          [el.icon.leftOrg, le.icon.topOrg]
        ]);
      });
    }

    function _sizeVisCalculate() {
      this._tooltips.forEach(function (el) {
        var offset = el.$element.offset();

        el.width = el.$element.outerWidth();
        el.height = el.$element.outerHeight();
        el.left = offset.left;
        el.top = offset.top;
        el.visibility = el.$element.is(':visible');
      });
    }

    function _sort() {
      this._tooltips.sort(function (a, b) {
        if (a.top < b.top) {
          return 1;
        }
        if (a.top > b.top) {
          return -1;
        }
        if (a.left < b.left) {
          return 1;
        }
        if (a.left > b.left) {
          return -1;
        }
        return 0;
      });
    }

    function _getCanvasStyle(el, canvas) {
      var centerX = el.left + el.width / 2;
      var centerY = el.top + el.height / 2;
      var width = CANVAS_WIDTH;
      var height = CANVAS_HEIGHT;
      var left = centerX - CANVAS_WIDTH;
      var top = centerY - CANVAS_HEIGHT;
      var minLeft = ICON_WIDTH / 2;

      if (left < minLeft) {
        width = width - (minLeft - left);
        left = minLeft;
      }

      if (top < 0) {
        height += top;
        top = 0;
      }

      canvas.widthOrg = width;
      canvas.heightOrg = height;
      canvas.leftOrg = left;
      canvas.topOrg = top;

      canvas.width = width + 'px';
      canvas.height = height + 'px';
      canvas.left = left + 'px';
      canvas.top = top + 'px';
    }

    function _getIconStyle(el, icon) {
      var canvasPosition = el.canvas;
      var top = canvasPosition.topOrg;
      icon.left = canvasPosition.left;
      icon.top = top + BZ_HEIGHT + 'px';

      icon.leftOrg = canvasPosition.leftOrg;
      icon.topOrg = top + BZ_HEIGHT;
    }

    function _checkPointInsidePolygon(point, vs) {
      var x = point[0], y = point[1];

      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      return inside;

    }

  }
})();
