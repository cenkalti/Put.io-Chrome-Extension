(function() {
    var module = angular.module('settingsModule', ['messageFactory', 'logFactory', 'ngCookies']);

    module.controller('settingsController', ['$scope', 'putio', 'message', '$filter', 'log', '$cookies',
        function($scope, putio, Message, $filter, Log, $cookies) {
            var log = new Log(module),
                message = new Message();

            $scope.putio = {
                default_folder: {
                    name: 'Loading ...'
                }
            };

            $scope.maybe_update_default_folder = function(id) {
                wp.event(module, 'settings', 'maybe_update_default_folder');

                $('.tree').modal('show');
            };

            $scope.update_default_folder = function(node) {
                wp.event(module, 'settings', 'update_default_folder');

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
                home_page: $cookies.get('home_page') || 'home',
                notification: $cookies.get('notification') === undefined ? true : $cookies.get('notification')
            };

            $scope.update_home_page = function() {
                wp.event(module, 'settings', 'update_home_page', $scope.app.home_page);

                $cookies.put('home_page', $scope.app.home_page);
            };

            $scope.update_notification = function() {
                wp.event(module, 'settings', 'update_notification', $scope.app.notification.toString());

                $cookies.put('notification', $scope.app.notification);

                log.debug('sending notification message');
                message.send('notification', $$scope.app.notification);
            };

            $scope.reset_auth = function() {
                wp.event(module, 'authentication', 'reset');

                putio.auth_reset(function() {
                    window.close();
                });
            };

            $scope.reset_app = function() {
                wp.event(module, 'application', 'reset');

                var cookies = $cookies.getAll();

                for (var key in cookies) {
                    $cookies.remove(key);
                }

                putio.auth_reset(function() {
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

            putio.account_settings(function(err, data) {
                $scope.putio.default_folder.id = data.settings.default_download_folder;

                putio.file($scope.putio.default_folder.id, function(err1, data1) {
                    $scope.putio.default_folder.name = data1.file.name;
                });
            });
        }
    ]);
})();