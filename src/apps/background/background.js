(function() {
    var deps = [
            'logFactory',
            'putioService',
            'badgeService',
            'menuService',
            'transfersCheckService',
            'messageFactory',
            'libraryFactory',
            'storageFactory',
            'interfaceService'
        ],
        module = angular.module('BackgroundApp', deps);

    module.controller('BackgroundController', [
        'Log',
        'Message',
        'putio',
        'badge',
        'menu',
        'transfersCheck',
        'Library',
        'Storage',
        '$timeout',
        'interface',
        function(Log, Message, putio, badge, menu, transfersCheck, Library, Storage, $timeout, interface) {
            var log = new Log(module),
                message = new Message(),
                storage = new Storage('settings'),
                shouldNotify = storage.get('notification');

            message.listen('reset', function() {
                log.debug('received reset message');
                location.reload();
            });

            authenticate(function() {
                var library = new Library();

                library.crawl(0, function() {
                    library.start_listeners();
                });

                badge.display(putio);

                menu.display(putio);

                track();

                if (shouldNotify !== null) {
                    maybe_transfers_check(shouldNotify);
                } else {
                    maybe_transfers_check(true);
                }

                message.listen('notification', function(startStop) {
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
                    wp.identify({
                        email: data.info.mail,
                        name: data.info.username,
                        version: interface.version()
                    }, function() {});
                });
            }

            function authenticate(callback) {
                putio.simple_auth(function(err) {
                    if (err) {
                        log.warn(err);
                        $timeout(function() {
                            authenticate(callback);
                        }, 5000);
                    } else {
                        callback(true);
                    }
                }, true);
            }
        }
    ]);
})();