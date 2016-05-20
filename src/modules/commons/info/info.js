(function() {
    var module = angular.module('infoModule', ['putioService', 'demoModule', 'ui.bootstrap', 'libraryFactory']);

    module.directive('info',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/info-directive.html',
                controller: 'infoController',
                scope: {}
            };
        }
    );

    module.controller('infoController', ['$scope', 'putio', 'Library',
        function($scope, putio, Library) {
            var library = new Library();


            $scope.disk = {};

            $scope.$on('info.refresh', function() {
                info_refresh();
                library.check(function() {});
            });

            info_refresh();

            function info_refresh() {
                putio.account_info(function(err, data) {
                    var info = data.info,
                        disk = info.disk;

                    $scope.disk.used = disk.used;
                    $scope.disk.size = disk.size;
                    $scope.disk.percent = Math.round(((100 * disk.used) / disk.size));

                    if ($scope.disk.percent < 25) {
                        $scope.disk.type = 'success';
                    } else if ($scope.disk.percent < 50) {
                        $scope.disk.type = 'info';
                    } else if ($scope.disk.percent < 75) {
                        $scope.disk.type = 'warning';
                    } else {
                        $scope.disk.type = 'danger';
                    }
                });
            }
        }
    ]);
})();