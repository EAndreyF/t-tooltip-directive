(function () {
  'use strict';

  angular
    .module('cst.tooltip', [])
    .run(Run);

  Run.$inject = ['$document', '$rootScope', '$compile'];

  function Run($document, $rootScope, $compile) {
    var $body = $document.find('body');
    var el = angular.element("<cst-tooltips></cst-tooltips>");
    var $tooltipScope = $rootScope.$new();
    var $el = $compile(el)($tooltipScope);
    el.remove();
    $body.append($el);
  }
})();
