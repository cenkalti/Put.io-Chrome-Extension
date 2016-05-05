(function() {
    var module = angular.module('settingsModule', ['messageFactory', 'logFactory']);

    module.controller('settingsController', ['$scope', 'putio', 'message', '$filter', 'log',
        function($scope, putio, Message, $filter, Log) {
            var log = new Log(module),
                message = new Message();

            $scope.putio = {
                default_folder: {
                    name: 'Loading ...'
                }
            };

            $scope.maybe_update_default_folder = function(id) {
                wp.event(module, 'options_update', 'maybe_default_folder');

                $('.tree').modal('show');
            };

            $scope.update_default_folder = function(node) {
                wp.event(module, 'options_update', 'default_folder');

                $('.tree').modal('hide');
                putio.account_set_settings({
                    default_download_folder: node.id
                }, function(err, data) {
                    $scope.putio.default_folder = {
                        name: node.name,
                        id: node.id
                    };
                });
            };

            $scope.selected = function(node) {
                if (node.content_type == 'application/x-directory') {
                    $scope.modalOptions.saveBtn.disabled = false;
                    $scope.modalOptions.saveBtn.text = 'Update to: ' + $filter('limitTo')(node.name, 25);
                } else {
                    $scope.modalOptions.saveBtn.text = 'Nope Nope Nope';
                    $scope.modalOptions.saveBtn.disabled = true;
                }
            };

            $scope.app = {
                home_pages: {
                    home: 'Home',
                    transfers: 'Transfers',
                    files: 'Files',
                    settings: 'Settings',
                    friends: 'Friends',
                    library: 'Library'
                },
                home_page: 'home',
                notification: true
            };

            $scope.update_home_page = function() {
                wp.event(module, 'options_update', 'home_page', $scope.app.home_page);

                putio.options_get(function(err, options) {
                    options.home_page = $scope.app.home_page;
                    putio.options_set(options, function() {});
                });
            };

            $scope.update_notification = function() {
                wp.event(module, 'options_update', 'notification', $scope.app.notification.toString());

                putio.options_get(function(err, options) {
                    options.notification = $scope.app.notification;

                    putio.options_set(options, function() {
                        log.debug('sending notification message');
                        message.send('notification', $$scope.app.notification);
                    });
                });
            };

            $scope.reset_auth = function() {
                wp.event(module, 'authentication', 'reset');

                putio.auth_reset(function() {
                    window.close();
                });
            };

            $scope.reset_app = function() {
                wp.event(module, 'application', 'reset');

                putio.reset_app(function() {
                    chrome.windows.create({
                        url: 'https://put.io/user/api/apps',
                        type: 'normal'
                    }, function() {
                        window.close();
                    });
                });
            };

            $scope.treeModalOptions = {
                title: 'Files',
                saveBtn: {
                    text: 'Move',
                    disabled: true
                }
            };

            putio.options_get(function(err, options) {
                $scope.$apply(function() {
                    if (options.home_page) {
                        $scope.app.home_page = options.home_page;
                    }
                    if (options.notification !== undefined) {
                        $scope.app.notification = options.notification;
                    }
                });
            });

            putio.account_settings(function(err, data) {
                $scope.putio.default_folder.id = data.settings.default_download_folder;

                putio.file($scope.putio.default_folder.id, function(err1, data1) {
                    $scope.putio.default_folder.name = data1.file.name;
                });
            });
        }
    ]);
})();