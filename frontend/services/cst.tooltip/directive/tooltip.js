(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .directive('cstTooltipDir', Directive);

  function Directive() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'services/cst.tooltip/directive/tooltip.html',
      controller: TooltipCtrl,
      controllerAs: 'tp'
    };
  }

  TooltipCtrl.$inject = ['$scope', '$element'];

  function TooltipCtrl($scope, $element) {
    $element = $($element[0]);
    var $el = $($scope.element);
    var $canvas = $element.find('canvas');
    var $tooltip = $element.find('.cst-tooltip');

    var iconSize = [36 + 40 * 2, 36];

    $scope.$on('update', _update);

    return {
      getCanvasStyle: getCanvasStyle,
      getIconsStyle: getIconsStyle
    };

    function getCanvasStyle() {
      return {
      }
    }

    function getIconsStyle() {
      var center = _getElCenter($el);
      var tooltipOffset = _getElOffset($tooltip);
      return {
        left: center[0] + tooltipOffset[0] + 'px',
        top: center[1] - tooltipOffset[1] + 'px'
      }
    }

    function _update() {
      console.debug('updated');
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
