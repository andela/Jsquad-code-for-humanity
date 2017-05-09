angular.module('mean.system')
  .factory('socket', ['$rootScope', function ($rootScope) {
    const socket = io.connect();
    return {
      on(eventName, callback) {
        socket.on(eventName, function () {
          const args = arguments;
          $rootScope.safeApply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit(eventName, data, callback) {
        let args;
        socket.emit(eventName, data, function () {
          args = arguments;
        });

        $rootScope.safeApply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      },
      removeAllListeners(eventName, callback) {
        socket.removeAllListeners(eventName, function () {
          const args = arguments;
          $rootScope.safeApply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
