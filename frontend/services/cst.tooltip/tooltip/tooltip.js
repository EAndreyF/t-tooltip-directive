(function () {
  'use strict';

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
    var $tooltip = $element.find('.cst-tooltip');

    var iconSize = [36 + 40 * 2, 36];

    $scope.$on('update', _update);

    $scope._getElCenter = _getElCenter;

    return {
      getCanvasStyle: getCanvasStyle,
      getIconsStyle: getIconsStyle,
      getMainStyle: getMainStyle
    };

    function getMainStyle() {
      return {
      }
    }

    function getCanvasStyle() {
      return {
      }
    }

    function getIconsStyle() {
      console.debug('updated');
      var center = _getElCenter($el);
      var tooltipOffset = _getElOffset($tooltip);
      return {
        left: center[0] + tooltipOffset[0] + 'px',
        top: center[1] - tooltipOffset[1] + 'px'
      }
    }

    function _update() {
      //console.debug('updated');
    }

    function _getElCenter($el) {
      var offset = _getElOffset($el);
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
  }

})();
