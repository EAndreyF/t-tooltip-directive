(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .directive('cstTooltipDir', Directive);

  function Directive() {
    return {
      restrict: 'E',
      templateUrl: 'services/cst.tooltip/directive/tooltip.html',
      controller: TooltipCtrl,
      controllerAs: 'tp'
    };
  }

  function TooltipCtrl() {}

})();
