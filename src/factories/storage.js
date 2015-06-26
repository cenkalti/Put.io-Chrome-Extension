(function() {
    var module = angular.module('storageFactory', []);

    module.factory('storage', [
        function() {
            var storage = function(type) {
                var self = this;

                self.type = type || "local";
            };

            storage.prototype.get = function(key, callback) {
                var self = this;

                chrome.storage[self.type].get(key, function(data) {
                    if (typeof callback == "function") {
                        callback(data[key]);
                    }
                });
            };

            storage.prototype.set = function(key, value, callback) {
                var self = this,
                    data = {};

                data[key] = value;

                chrome.storage[self.type].set(data, function() {
                    if (typeof callback == "function") {
                        callback(data[key]);
                    }
                });
            };

            return storage;
        }
    ]);
})();