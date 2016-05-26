(function() {
    var module = angular.module('updownService', ['logFactory', 'configModule']);

    module.service('updown', ['Log', '$http', 'UPDOWN_KEY',
        function(Log, $http, UPDOWN_KEY) {
            var updown = this,
                // log = new Log(module),
                baseUrl = ' https://updown.io/api';

            updown.check = function(token, callback) {
                request({
                    verb: 'GET',
                    url: '/checks/' + token
                }, callback);
            };

            function request(options, callback) {
                var config = {
                    method: options.verb,
                    url: get_url(options.url),
                    data: options.data,
                    headers: {
                        Accept: 'application/json'
                    }
                };

                if (options.data === undefined || options.data === null) {
                    delete config.data;
                }

                $http(config)
                    .success(function(data) {
                        callback(null, data);
                    }).error(function(data) {
                        callback(data, null);
                    });
            }

            function get_url(url) {
                if (url.match(/\?/g)) {
                    return baseUrl + url + '&api-key=' + UPDOWN_KEY;
                } else {
                    return baseUrl + url + '?api-key=' + UPDOWN_KEY;
                }
            }
        }
    ]);
})();