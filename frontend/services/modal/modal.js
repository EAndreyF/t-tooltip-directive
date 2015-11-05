angular.module('App.service.modal', [
  'App.service.modal.confirm'
])
    .factory('Modal', function ($window, $compile, $timeout, $rootScope, $templateCache) {
      var model = {
        dialog: [],
        close: function (id) {
          model.dialog[id] && model.dialog[id].close();
        },
        open: function (template, scope, id, className) {
          id = id || Math.random(1000 * 1000);
          className = className || '';
          if (!model.dialog[id]) {
            var container = angular.element($window.document.body);
            var element = angular.element('<div class="rs-modal" template="template"></div>');

            scope = scope && scope.$new() || $rootScope.$new();
            scope.template = template;
            scope.className = className;
            scope.close = function () {
              scope.$destroy();
              element.remove();
              delete model.dialog[id];
            };

            model.dialog[id] = scope;

            $compile(element)(scope);
            container.append(element);

            return scope;
          } else {
            return model.dialog[id];
          }
        },
        confirm: function (options) {
          options = options || {};
          var scope = $rootScope.$new();
          scope.confirm = {
            title: options.title || 'Confirm action',
            ok: options.ok || 'OK',
            cancel: options.cancel || 'Cancel',
            result: $.Deferred()
          };
          model.open('services/modal/confirm/confirm.html', scope, 'modal-confirm', options.className);
          return scope.confirm.result.always(function () {
            model.close('modal-confirm');
          })
        }
      };

      return model;
    })

    .directive('rsModal', function () {
      return {
        restrict: 'C',
        templateUrl: 'services/modal/modal.html',
        scope: true,
        controller: function ($scope) {
          var model = {
            getTemplate: function () {
              return $scope.template;
            }
          };
          $scope.rModal = model;
        }
      };
    });