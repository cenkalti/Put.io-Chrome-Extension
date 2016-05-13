(function() {
    var deps = [
            'logFactory',
            'putioService',
            'badgeService',
            'menuService',
            'transfersCheckService',
            'messageFactory',
            'libraryFactory',
            'ngCookies'
        ],
        module = angular.module('BackgroundApp', deps);

    module.controller('BackgroundController', [
        'log',
        'message',
        'putio',
        'badge',
        'menu',
        'transfersCheck',
        'library',
        '$cookies',
        function(Log, Message, putio, badge, menu, transfersCheck, Library, $cookies) {
            var log = new Log(module),
                message = new Message(),
                shouldNotify = $cookies.get('notification');

            authenticated(function() {
                var library = new Library();

                library.crawl(0, function() {
                    library.start_listeners();
                });

                badge.display(putio);

                menu.display(putio);

                track();

                if (shouldNotify !== undefined) {
                    maybe_transfers_check(shouldNotify);
                } else {
                    maybe_transfers_check(true);
                }

                message.listen('notification', function(startStop, send) {
                    log.debug('received notification message');

                    if (startStop) {
                        wp.event(module, 'notification', 'enable');
                    } else {
                        wp.event(module, 'notification', 'disable');
                    }

                    maybe_transfers_check(startStop);
                });

            });

            function maybe_transfers_check(start) {
                log.debug('maybe_transfers_check', start);

                if (start) {
                    transfersCheck.start(putio);
                } else {
                    transfersCheck.stop();
                }
            }

            function track() {
                putio.account_info(function(err, data) {
                    var disk = data.info,
                        manifest = chrome.runtime.getManifest();

                    wp.identify({
                        email: data.info.mail,
                        name: data.info.username,
                        version: manifest.version
                    }, function() {);
                });
            }

            function authenticated(callback) {
                putio.auth(function(err) {
                    if (err) {
                        log.warn(err);
                        $timeout(function() {
                            authenticate(callback);
                        }, 5000);
                    } else {
                        callback(true);
                    }
                });
            }
        }
    ]);
})();