(function() {
    var module = angular.module('storageFactory', ['logFactory', 'LocalStorageModule']);

    module.config(function(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('putio');
    });

    module.factory('Storage', ['Log', 'localStorageService',
        function(Log, localStorage) {

            var storage = function(prefix) {
                var self = this;

                self.log = new Log(module);
                self.prefix = prefix || 'ls';

                if (localStorage.isSupported) {
                    self.log.debug('local storage is supported');
                } else {
                    self.log.warn('local storage is not supported');
                }

                return self;
            };

            storage.prototype.keys = function() {
                var self = this,
                    re = new RegExp(self.key(''), '');

                return localStorage.keys()
                    .filter(function(key) {
                        return re.test(key);
                    })
                    .map(function(key) {
                        return key.replace(re, '');
                    });
            };

            storage.prototype.clearAll = function() {
                var self = this,
                    keys = self.keys();

                keys.forEach(function(key) {
                    localStorage.remove(self.key(key));
                });

                return true;
            };

            storage.prototype.destroy = function() {
                return localStorage.clearAll();
            };

            storage.prototype.get = function(key) {
                var self = this;

                return localStorage.get(self.key(key));
            };

            storage.prototype.set = function(key, value) {
                var self = this;

                return localStorage.set(self.key(key), value);
            };

            storage.prototype.remove = function(key) {
                var self = this;

                return localStorage.remove(self.key(key));
            };

            storage.prototype.key = function(key) {
                var self = this;

                return self.prefix + '.' + key;
            };

            return storage;
        }
    ]);
})();