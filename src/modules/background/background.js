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

            // ########## BADGE ##########

            badge.display();

            // ########## MENUs ##########

            menu.display();

            // ########## TRANSFERS CHECKS ##########

            putio.options_get(function(err, options) {
                if (options.notification !== undefined) {
                    maybe_transfers_check(options.notification);
                } else {
                    maybe_transfers_check(true);
                }
            });

            message.listen("notification", function(data, send) {
                log.debug("received notification message");
                maybe_transfers_check(data);
            });

            function maybe_transfers_check(start) {
                log.debug("maybe_transfers_check", start);
                if (start) {
                    transfersCheck.start();
                } else {
                    transfersCheck.stop();
                }
            }
        }
    ]);
})();