(function() {
    var module = angular.module('newsModule', ['ngCookies', 'configModule']);

    module.directive('news',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/news-directive.html',
                controller: 'newsController',
                scope: {}
            };
        }
    );

    module.controller('newsController', ['$scope', '$cookies', 'PUTIO_SERVER',
        function($scope, $cookies, PUTIO_SERVER) {


            $scope.url =  'http://' + PUTIO_SERVER + '/news';
            $scope.alreadySeen = true;

            $scope.loaded = function() {
                var id = get_id();

                if (id !== $cookies.get('news')) {
                    $scope.alreadySeen = false;
                }
            };

            $scope.seen = function() {
                var id = get_id();

                wp.event(module, 'news', 'view', id);

                $cookies.put('news', id, {
                    expires: moment().add(7, 'days').toDate()
                });
                $scope.alreadySeen = true;
            };

            $scope.$on('news.show', function() {
                $scope.alreadySeen = false;
            });

            function get_id() {
                return $('.news .alert')
                    .data('id')
                    .toString();
            }
        }
    ]);
})();