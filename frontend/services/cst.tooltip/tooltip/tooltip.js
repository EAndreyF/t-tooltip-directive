(function () {
  'use strict';

  var CANVAS_WIDTH = 150;
  var CANVAS_HEIGHT = 250;
  var BZ_WIDTH = 50;
  var BZ_HEIGHT = 50;

  angular
    .module('cst.tooltip')
    .directive('cstTooltip', TooltipDirective);

  function TooltipDirective() {
    return {
      restrict: 'E',
      scope: {
        element: '='
      },
      templateUrl: 'services/cst.tooltip/tooltip/tooltip.html',
      controller: TooltipCtrl,
      controllerAs: 'tp',
      bindToController: true
    };
  }

  TooltipCtrl.$inject = ['$scope', '$element'];

  function TooltipCtrl($scope, $element) {
    var tp = this;

    $element = $($element[0]);
    var $el = $(tp.element);
    var $canvas = $element.find('canvas');
    var ctx = $canvas[0].getContext("2d");
    var $tooltip = $element.find('.cst-tooltip');

    var iconSize = [36 + 40 * 2, 36];

    $scope.$on('update', _update);

    return {
      getCanvasStyle: getCanvasStyle,
      getIconsStyle: getIconsStyle,
      getMainStyle: getMainStyle,
      _canvasLineDraw: _canvasLineDraw,
      _getElCenter: _getElCenter,
      _getElOffset: _getElOffset,
      _getCanvasPosition: _getCanvasPosition
    };

    function getMainStyle() {
      return {
      }
    }

    function getCanvasStyle() {
      this._canvasLineDraw();
      var leftTop = this._getCanvasPosition();
      return {
        width: CANVAS_WIDTH + 'px',
        height: CANVAS_HEIGHT + 'px',
        left: leftTop.left + 'px',
        top: leftTop.top + 'px'
      }
    }

    function getIconsStyle() {
      var canvasPosition =  this._getCanvasPosition();
      return {
        left: canvasPosition.left + 'px',
        top: canvasPosition.top + BZ_HEIGHT + 'px'
      }
    }

    function _getCanvasPosition() {
      var center = this._getElCenter($el);
      var tooltipOffset = this._getElOffset($tooltip);
      return {
        left: center[0] - tooltipOffset[0] - CANVAS_WIDTH,
        top: center[1] - tooltipOffset[1] - CANVAS_HEIGHT
      };
    }

    function _update() {
      //console.debug('updated');
    }

    function _getElCenter($el) {
      var offset = this._getElOffset($el);
      var width = $el.outerWidth();
      var height = $el.outerHeight();

      var centerX = offset[0] + width / 2;
      var centerY = offset[1] + height / 2;
      return [centerX, centerY];
    }

    function _getElOffset($el) {
      var offset = $el.offset();
      return [offset.left, offset.top];
    }

    function _canvasLineDraw() {
      var width = $canvas.width();
      var height = $canvas.height();
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.bezierCurveTo(BZ_WIDTH, BZ_HEIGHT, BZ_WIDTH, BZ_HEIGHT, 0, BZ_HEIGHT);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6eb41d";
      ctx.stroke();
    }
  }

})();
