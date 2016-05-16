(function() {
    var module = angular.module('menuModule', ['putioService', 'ui.bootstrap', 'ngCookies']);

    module.directive('menu',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/menu-directive.html',
                controller: 'menuController',
                scope: {
                    toggle: '&',
                    open: '&',
                    close: '&'
                }
            };
        }
    );

    module.controller('menuController', ['$scope', '$location', '$route', '$rootScope', 'putio', '$cookies',
        function($scope, $location, $route, $rootScope, putio, $cookies) {
            var $menu = $('.menu'),
                version = chrome.runtime.getManifest().version;

            $scope.transfers_count = 0;
            $scope.files_size = 0;
            $scope.friend_requests = 0;
            $scope.rate = {
                readonly: $cookies.get('rate.' + version) ? true : false,
                value: $cookies.get('rate.' + version) || 0,
                version: version,
            };

            $scope.rate.do = function() {
                if (!$scope.rate.readonly) {
                    var val = $scope.rate.value;

                    $cookies.put('rate.' + version, val);
                    wp.rate(parseInt(val), version);

                    $scope.rate.readonly = true;

                    $scope.close();
                }
            };

            $scope.toggle = function() {
                $menu.animate({
                    width: 'toggle',
                    easing: 'easeOutQuad'
                }, 300);
            };

            $scope.open = function() {
                $menu.animate({
                    width: 'show',
                    easing: 'easeOutQuad'
                }, 300);
            };

            $scope.close = function() {
                $menu.animate({
                    width: 'hide',
                    easing: 'easeOutQuad'
                }, 300);
            };

            $scope.is_active = function(route) {
                return route === $location.path();
            };

            $rootScope.$on('$locationChangeStart', function() {
                $scope.close();
            });

            $scope.$on('menu.toggle', function() {
                $scope.toggle();
            });

            $scope.$on('info.refresh', function() {
                info_refresh();
            });

            $scope.$on('transfers_count.refresh', function() {
                transfers_count_refresh();
            });

            $scope.$on('friends_req.refresh', function() {
                friends_req_refresh();
            });

            $scope.$on('putio.authenticated', function() {
                info_refresh();
                transfers_count_refresh();
                friends_req_refresh();
            });

            $(document).mouseup(function(e) {
                if (!$('i.fa.fa-bars').is(e.target) &&
                    !$menu.is(e.target) &&
                    $menu.has(e.target).length === 0) {
                    $scope.close();
                }
            });

            function info_refresh() {
                putio.account_info(function(err, data) {
                    var info = data.info;
                    $scope.files_size = info.disk.used;
                });

            }

            function transfers_count_refresh() {
                putio.transfers_count(function(err, data) {
                    $scope.transfers_count = data.count;
                });
            }

            function friends_req_refresh() {
                putio.friends_req(function(err, data) {
                    $scope.friend_requests = data.friends.length;
                });
            }
        }
    ]);
})();