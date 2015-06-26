(function() {
    var module = angular.module('messageFactory', []);

    module.factory('message', [

        function() {
            var message = function() {

            };

            message.prototype.listen = function(key, callback) {
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        if (request.key === key) {
                            callback(request.data, sendResponse, sender);
                        }
                    }
                );
            };

            message.prototype.send = function(key, data, callback) {
                chrome.runtime.sendMessage({
                    "key": key,
                    "data": data
                }, function(resp) {
                    if (typeof callback === "function") {
                        callback(resp);
                    }
                });
            };

            return message;
        }
    ]);
})();