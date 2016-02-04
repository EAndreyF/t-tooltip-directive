(function () {
  'use strict';

  angular
    .module('App.service.spinner', [
      'App.service.modal'
    ])
    .factory('Spinner', Spinner);

  Spinner.$inject = ['Modal'];

  function Spinner(Modal) {
    var spinnersCount = 0;
    var timer = null;
    var modal = null;

    return {
      hide: hide,
      show: show
    };

    function hide() {
      setTimeout(function () {
        if (!--spinnersCount) {
          clearTimeout(timer);
          modal && modal.close();
          modal = null;
        }
      }, 300);
    }

    function show() {
      var _this = this;
      spinnersCount++;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        if (spinnersCount !== 0) {
          spinnersCount = 1;
          _this.hide();
          alert('Something goes wrong, please try again or reload page');
        }
      }, 60 * 1000);

      if (!modal) {
        modal = Modal.open({
          template: '<div></div>',
          windowTemplateUrl: 'services/spinner/spinner.html',
          windowClass: 'modal'
        });
      }
    }
  }

})();
