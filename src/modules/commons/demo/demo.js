(function() {
    var module = angular.module('demoModule', []);

    module.directive('demo',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/demo-directive.html',
                controller: 'demoController',
                scope: {
                    config: '=',
                    onFinish: '&',
                    onSkip: '&'
                }
            };
        }
    );

    module.controller('demoController', ['$scope',
        function($scope) {
            $scope.start = false;

            $scope.help = function() {
                $scope.start = true;
            };

            $scope.finish = function() {
                ga('send', 'event', 'demo', 'finish');
                $scope.onFinish();
            };

            $scope.skip = function() {
                ga('send', 'event', 'demo', 'skip');
                $scope.onSkip();
            };
        }
    ]);

})();