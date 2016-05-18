(function() {
    var module = angular.module('badgeService', ['putioService', 'logFactory']);

    module.service('badge', ['$timeout', '$interval', 'putio', 'Log',
        function($timeout, $interval, putio, Log) {
            var log = new Log(module),
                badge = this,
                delay = 60000;

            badge.display = function() {
                putio.auth(function(err) {
                    if (err) {
                        log.warn(err);
                        $timeout(function() {
                            badge.display();
                        }, 20000);
                    } else {
                        badge.set();
                        $interval(function() {
                            badge.set();
                        }, delay);
                    }
                });
            };

            badge.set = function() {
                putio.account_info(function(err, data) {
                    if (err) {
                        log.warn(err.error_message);
                    } else {
                        var disk = data.info.disk,
                            percentUsed = ((100 * disk.used) / disk.size).toFixed(2);

                        if (percentUsed <= 50) {
                            set_badge_color([70, 136, 71, 200]);
                        }

                        if (percentUsed > 50 && percentUsed <= 75) {
                            set_badge_color([248, 148, 6, 200]);
                        }

                        if (percentUsed > 75) {
                            set_badge_color([255, 40, 38, 200]);
                        }
                    }

                });

                putio.transfers_count(function(err, data) {
                    if (err) {
                        log.warn(err.error_message);
                    } else {
                        set_badge_text(data.count);
                    }
                });
            };

            function set_badge_color(color) {
                chrome.browserAction.setBadgeBackgroundColor({
                    'color': color
                });
            }

            function set_badge_text(text) {
                if (text !== null && text !== undefined) {
                    chrome.browserAction.setBadgeText({
                        'text': text.toString()
                    });
                }
            }
        }
    ]);
})();