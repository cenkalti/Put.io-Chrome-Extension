(function() {
    var module = angular.module('menuModule', ['putioService']);

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

    module.controller('menuController', ['$scope', '$location', '$route', 'putio',
        function($scope, $location, $route, putio) {
            var $menu = $('.menu');

            $scope.transfers_count = 0;
            $scope.files_size = 0;
            $scope.friend_requests = 0;

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

            $scope.$root.$on('$locationChangeStart', function(event, args) {
                $scope.close();
            });

            $scope.$on('menu_open', function(event, args) {
                $scope.open();
            });

            $scope.$on('menu_close', function(event, args) {
                $scope.close();
            });

            $scope.$on('menu_toggle', function(event, args) {
                $scope.toggle();
            });

            $scope.$on('refresh_info', function(event, args) {
                refresh_info();
            });

            $scope.$on('refresh_transfers_count', function(event, args) {
                refresh_transfers_count();
            });

            $scope.$on('refresh_friends_req', function(event, args) {
                refresh_friends_req();
            });

            $scope.$on('putio.authenticated', function() {
                refresh_info();
                refresh_transfers_count();
                refresh_friends_req();
            });

            $(document).mouseup(function(e) {
                if (!$menu.is(e.target) && $menu.has(e.target).length === 0) {
                    $scope.close();
                }
            });

            function refresh_info() {
                putio.account_info(function(err, data) {
                    var info = data.info;
                    $scope.files_size = info.disk.used;
                });

            }

            function refresh_transfers_count() {
                putio.transfers_count(function(err, data) {
                    $scope.transfers_count = data.count;
                });
            }

            function refresh_friends_req() {
                putio.friends_req(function(err, data) {
                    $scope.friend_requests = data.friends.length;
                });
            }
        }
    ]);
})();