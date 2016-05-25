(function() {
    var module = angular.module('newsModule', ['ngCookies']);

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

    module.controller('newsController', ['$scope', '$cookies',
        function($scope, $cookies) {

            $scope.url = 'http://45.55.220.5:8080/news';
            $scope.alreadySeen = true;

            $scope.loaded = function() {
                var id = get_id();

                if (id !== $cookies.get('news')) {
                    $scope.alreadySeen = false;
                }
            };

            $scope.seen = function() {
                $cookies.put('news', get_id());
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