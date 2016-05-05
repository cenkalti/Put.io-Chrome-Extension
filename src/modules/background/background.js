(function() {
    var deps = [
            'logFactory',
            'putioService',
            'badgeService',
            'menuService',
            'transfersCheckService',
            'messageFactory',
            'libraryFactory'
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
        function(Log, Message, putio, badge, menu, transfersCheck, Library) {
            var log = new Log(module),
                message = new Message();

            authenticated(function() {
                badge.display(putio);

                menu.display(putio);

                track();

                putio.options_get(function(err, options) {
                    if (options.notification !== undefined) {
                        maybe_transfers_check(options.notification);
                    } else {
                        maybe_transfers_check(true);
                    }
                });

                message.listen('notification', function(maybeStart, send) {
                    log.debug('received notification message');

                    if (maybeStart) {
                        wp.event(module, 'notification', 'enable');
                    } else {
                        wp.event(module, 'notification', 'disable');
                    }

                    maybe_transfers_check(maybeStart);
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
                    }, function() {
                        wp.event(module, 'authenticated', 'background');
                        wp.page_view('background', '/background');
                    });
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