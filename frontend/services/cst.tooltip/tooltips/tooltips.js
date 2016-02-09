(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .directive('cstTooltips', TooltipsDirective);

  function TooltipsDirective() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'services/cst.tooltip/tooltips/tooltips.html',
      controller: TooltipsCtrl,
      controllerAs: 'tps'
    };
  }

  TooltipsCtrl.$inject = ['$scope', '$document', 'cstTooltipFct'];

  function TooltipsCtrl($scope, $document, cstTooltipFct) {

    $document.on('click', function (event) {
      var element = event.target;
      if (cstTooltipFct.addTooltip(element)) {
        $scope.$digest();
      }
    });

    $scope.$watch(function() {
      cstTooltipFct.recalc();
    });

    return {
      getTooltips: cstTooltipFct.getAllTooltips.bind(cstTooltipFct)
    };
  }

})();
