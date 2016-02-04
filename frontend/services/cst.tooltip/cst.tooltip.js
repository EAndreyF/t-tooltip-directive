(function () {
  'use strict';

  angular
    .module('cst.tooltip', [])
    .run(Run);

  Run.$inject = ['$document', '$rootScope', '$compile'];

  function Run($document, $rootScope, $compile) {
    var tooltips = [];
    var $body = $document.find('body');

    $document.on('click', function (event) {
      var element = event.target;

      if (!hasTooltip(element)) {
        console.log('add tooltip', event.target);
        addTooltip(element);
      } else {
        console.log('tooltip exists');
      }
    });

    function hasTooltip(element) {
      return tooltips.indexOf(element) !== -1
    }

    function addTooltip(element) {
      tooltips.push(element);
      var $scope = $rootScope.$new();
      $scope.element = element;
      var el = $compile("<cst-tooltip-dir></cst-tooltip-dir>")($scope);
      $body.append(el);
    }
  }
})();
