(function() {
    var module = angular.module('demoModule', []);

    module.directive('demo',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/demo-directive.html',
                controller: 'demoController',
                scope: {}
            };
        }
    );

    module.controller('demoController', ['$scope', '$location', '$rootScope',
        function($scope, $location, $rootScope) {

            $scope.start = false;
            $scope.config = demoData[get_title()];

            $rootScope.$on('$locationChangeSuccess', function(event, next, previous) {
                $scope.config = demoData[get_title()] || [];
            });

            $scope.help = function() {
                $scope.start = true;
            };

            $scope.finish = function() {
                wp.event(module, 'demo', 'skip', $scope.title);
                $scope.start = false;
            };

            $scope.skip = function() {
                wp.event(module, 'demo', 'skip', $scope.title);
                $scope.start = false;
            };

            function get_title() {
                var uri = $location.path(),
                    title = uri.split('/');

                return title[1] || 'home';
            }
        }
    ]);

    var demoData = {
        home: [{
            type: 'element',
            selector: '.btn-menu',
            heading: 'Menu',
            text: 'Here is the menu.',
            placement: 'right',
            scroll: false
        }, {
            type: 'element',
            selector: '.progress-bar-value',
            heading: 'Storage',
            text: 'Here you can find how much data is left in your account.',
            placement: 'bottom',
            scroll: false
        }, {
            type: 'title',
            heading: 'Home',
            text: 'The Home page contains an history of your downloads.'
        }, {
            type: 'element',
            selector: '.home > div:nth-child(3) a:first-child',
            heading: 'Go to file',
            text: 'Click to go to file/directory.',
            placement: 'bottom',
            scroll: true
        }]
    };

})();