(function() {
    var module = angular.module('interfaceService', ['logFactory']);

    module.service('interface', ['Log',
        function(Log) {
            var interface = this,
                log = new Log(module);

            interface.version = function() {
                var version;

                if (chrome) {
                    version = chrome.runtime.getManifest().version;
                }

                log.debug('getting version: ' + version);

                return version;
            };

            interface.create_window = function(options, callback) {
                if (chrome) {
                    chrome.windows.create(options, callback);
                }
            };

        }
    ]);
})();