(function() {
    var module = angular.module('logFactory', []);

    module.factory('log', ['$log', '$filter',
        function($log, $filter) {
            var log = function(mod) {
                var self = this;

                self.name = mod.name || 'unknown';
            };

            log.prototype.debug = function() {
                var self = this;
                $log.debug.apply(null, self.get_args(arguments));
            };

            log.prototype.error = function() {
                var self = this;
                $log.error.apply(null, self.get_args(arguments));
            };

            log.prototype.warn = function() {
                var self = this;
                $log.warn.apply(null, self.get_args(arguments));
            };

            log.prototype.info = function() {
                var self = this;
                $log.info.apply(null, self.get_args(arguments));
            };

            log.prototype.log = function() {
                var self = this;
                $log.debug.apply(null, self.get_args(arguments));
            };

            log.prototype.get_args = function(args) {
                var self = this,
                    date = $filter('date')(new Date(), '[yyyy-MM-dd HH:mm:ss:sss]'),
                    newArgs = Array.prototype.slice.call(args, 0);

                newArgs.unshift('[' + self.name + ']');
                newArgs.unshift(date);

                return newArgs;
            };

            return log;
        }
    ]);
})();