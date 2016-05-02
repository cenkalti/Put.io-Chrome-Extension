(function() {
    var module =
        angular.module(
            'putioApp', [
                'ngRoute',
                'angular-loading-bar',
                'putioService',
                'stringFilter',
                'bytesFilter',
                'homeModule',
                'transfersModule',
                'filesModule',
                'fileModule',
                'optionsModule',
                'friendsModule',
                'libraryModule',
                'menuModule',
                'ngJoyRide',
                'configModule'
            ]
        );

    module.config(['$routeProvider', 'cfpLoadingBarProvider',

        function($routeProvider, cfpLoadingBarProvider) {

            cfpLoadingBarProvider.includeSpinner = false;

            $routeProvider
                .when('/home', {
                    templateUrl: 'html/home-directive.html',
                    controller: 'homeController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/transfers', {
                    templateUrl: 'html/transfers-directive.html',
                    controller: 'transfersController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/transfer/:transfer_id', {
                    templateUrl: 'html/transfer-directive.html',
                    controller: 'transferController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/files', {
                    templateUrl: 'html/files-directive.html',
                    controller: 'filesController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/files/:parent_id', {
                    templateUrl: 'html/files-directive.html',
                    controller: 'filesController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/file/:file_id', {
                    templateUrl: 'html/file-directive.html',
                    controller: 'fileController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/options', {
                    templateUrl: 'html/options-directive.html',
                    controller: 'optionsController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/friends', {
                    templateUrl: 'html/friends-directive.html',
                    controller: 'friendsController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .when('/library', {
                    templateUrl: 'html/library-directive.html',
                    controller: 'libraryController',
                    resolve: {
                        putio: putioAuth
                    }
                })
                .otherwise({
                    'redirectTo': '/home'
                });

            function putioAuth($q, putio) {
                var deferred = $q.defer();

                putio.set_error_callback(function(err) {
                    wp.error(err.error_type, err.error_message);

                    if (err.error_message === 'Parent is not a folder') {
                        console.log('ignoring error: Parent is not a folder');
                    } else {
                        var $error_modal = $('#error_modal');

                        $('.modal-body p', $error_modal).html(err.error_message);
                        $error_modal.modal();
                    }

                    return err;
                });

                putio.set_ask_to_log(true);

                putio.auth(function(err) {
                    if (err) {
                        deferred.reject(null);
                    } else {
                        deferred.resolve(putio);
                    }
                });
                return deferred.promise;
            }
        }
    ]);

    module.controller('putioController', ['$scope', '$location', '$route', 'putio',
        function($scope, $location, $route, putio) {
            var logged = false;

            $scope.title = '';
            $scope.disk = {};

            $scope.reload = function() {
                $route.reload();
            };

            $scope.menu_toggle = function() {
                $scope.$root.$broadcast('menu_toggle');
            };

            $scope.$root.$on('$locationChangeSuccess', function(event, next, previous) {
                var uri = $location.path(),
                    title = uri.split('/');

                wp.page_view(title[1], uri);

                $scope.title = title[1];
            });

            $scope.$root.$on('refresh_file', function(event, next, previous) {
                refresh_file();
            });

            putio.auth(function(err) {
                if (!err) logged = true;
                refresh_file();
            });

            putio.options_get(function(err, options) {
                if (options.home_page) {
                    $location.path(options.home_page);
                }
            });

            // FUNCTIONS
            function refresh_file() {
                if (logged) {
                    putio.account_info(function(err, data) {
                        var disk = data.info.disk,
                            used = Math.round((disk.used * 100) / disk.size);

                        $scope.disk.used = disk.used;
                        $scope.disk.size = disk.size;
                        $scope.disk.percent = Math.round(((100 * disk.used) / disk.size));

                        wp.identify({
                            email: data.info.mail,
                            name: data.info.username
                        }, function() {
                            wp.event(module, 'logged', 'identify');
                        });



                    });
                }
            }
        }
    ]);

})();