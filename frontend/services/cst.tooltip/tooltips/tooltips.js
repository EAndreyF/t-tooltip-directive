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

  TooltipsCtrl.$inject = ['$scope', '$document', '$window', 'cstTooltipFct', '$rootScope'];

  function TooltipsCtrl($scope, $document, $window, cstTooltipFct, $rootScope) {

    var throttle = function(timeout, fn) {
      var lastCall = 0;
      var timeoutId;

      function wrapper() {
        if (+new Date() - lastCall > timeout) {
          lastCall = +new Date();
          fn();
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(fn, timeout);
        }
      }

      return wrapper;
    };

    $document.on('click', function (event) {
      var element = event.target;
      if (cstTooltipFct.addTooltip(element)) {
        cstTooltipFct.recalc();
        $scope.$digest();
      }
    });

    $($window).on('resize', throttle(100, function () {
      cstTooltipFct.recalc();
      $scope.$digest();
    }));

    $rootScope.$watch(function() {
      cstTooltipFct.recalc();
    });

    return {
      getTooltips: cstTooltipFct.getAllTooltips.bind(cstTooltipFct)
    };
  }

})();
