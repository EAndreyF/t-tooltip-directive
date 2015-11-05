angular.module('App.service.spinner', [
  'App.service.modal'
])
    .factory('Spinner', function (Modal) {
      var spinnersCount = 0;
      var model = {
        hide: function () {
          setTimeout(function () {
            if (!--spinnersCount) {
              clearTimeout(model.timer);
              Modal.close('$spinner');
            }
          }, 300);
        },
        timer: null,
        show: function () {
          spinnersCount++;
          if (model.timer) {
            clearTimeout(model.timer);
          }
          model.timer = setTimeout(function () {
            if (spinnersCount !== 0) {
              spinnersCount = 1;
              model.hide();
              alert('Something goes wrong, please try again or reload page');
            }
          }, 60 * 1000);
          Modal.open('services/spinner/spinner.html', null, '$spinner', 'spinner-background');
        }
      };

      return model;
    });