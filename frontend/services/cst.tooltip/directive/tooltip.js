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
    var $el = $($scope.element);
    var $canvas = $element.find('canvas');

    $scope.$on('update', update);

    return {
      getCanvasStyle: getCanvasStyle
    };

    function update() {
      console.debug('updated');
    }

    function getCanvasStyle() {
      return {
      }
    }
  }

})();
