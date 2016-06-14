(function() {
    var module =
        angular.module(
            'putioApp', [
                // Libs
                'ngRoute',
                'angular-loading-bar',
                'ngCookies',
                'ui-notification',
                // Filters
                'stringFilter',
                'bytesFilter',
                // Services
                'putioService',
                'storageFactory',
                'interfaceService',
                //Modules
                'configModule',
                'homeModule',
                'transfersModule',
                'filesModule',
                'fileModule',
                'settingsModule',
                'friendsModule',
                'libraryModule',
                'menuModule',
                'infoModule'
            ]
        );

    module.config([
        '$routeProvider',
        'cfpLoadingBarProvider',
        'NotificationProvider',
        function($routeProvider, cfpLoadingBarProvider, NotificationProvider) {

            NotificationProvider.setOptions({
                startTop: 61
            });

            cfpLoadingBarProvider.includeSpinner = false;

            $routeProvider
                .when('/', {
                    templateUrl: 'html/home-directive.html',
                    controller: 'homeController',
                    resolve: {
                        putio: putioAuth
                    }
                })
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
                .when('/settings', {
                    templateUrl: 'html/settings-directive.html',
                    controller: 'settingsController',
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
                    redirectTo: '/home'
                });

            function putioAuth($q, putio) {
                var deferred = $q.defer();

                putio.set_error_callback(function(err) {

                    if (err.error_type === 'invalid_client') {
                        putio.auth_reset();
                        window.close();
                    }

                    if (err.error_message === 'Parent is not a folder') {
                        console.log('ignoring error: Parent is not a folder');
                    } else if (err.error_type === 'NotFound') {
                        console.log('ignoring error: File not found');
                    } else {
                        if (err.error_type && err.error_message) {
                            wp.error(err.error_type, err.error_message);
                        }

                        var $errorModal = $('#error_modal');

                        $('.modal-body p', $errorModal).html(err.error_message || err.error_type);
                        $errorModal.modal();
                    }

                    return err;
                });

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

    module.controller('putioController', ['$scope', '$location', '$route', '$rootScope', 'putio', 'Storage', 'interface', 'Notification', '$cookies', 'PUTIO_SERVER',
        function($scope, $location, $route, $rootScope, putio, Storage, interface, notify, $cookies, PUTIO_SERVER) {
            var storage = new Storage('settings'),
                homePage = storage.get('home_page') || 'home';

            $scope.title = '';

            $scope.reload = function() {
                $route.reload();
            };

            $scope.menu_toggle = function() {
                $rootScope.$broadcast('menu.toggle');
            };

            $scope.$on('putio.authenticated', function() {
                putio.account_info(function(err, data) {
                    wp.identify({
                        email: data.info.mail,
                        name: data.info.username,
                        version: interface.version()
                    }, function(alreadyLogged) {
                        if (!alreadyLogged) wp.event(module, 'app', 'authenticated');
                    });
                });
            });

            $rootScope.$on('$locationChangeSuccess', function() {
                var uri = $location.path(),
                    titleArray = uri.split('/'),
                    title = titleArray[1] || 'home';

                wp.page_view(title, uri);

                $scope.title = title;

                document.title = title;
            });

            $rootScope.$on('news.show', function() {
                news();
            });

            var uri = $location.path(),
                titleArray = uri.split('/'),
                title = titleArray[1] || 'home';

            if (homePage !== title) {
                $location.path(homePage);
            }

            if (!$cookies.get('news')) {
                news();
            }

            function news() {
                notify.info({
                    positionX: 'center',
                    delay: 10000,
                    templateUrl: 'http://' + PUTIO_SERVER + '/news'
                });

                $cookies.put('news', moment().format('x'), {
                    expires: moment().add(7, 'd').toDate()
                });
            }

        }
    ]);

})();