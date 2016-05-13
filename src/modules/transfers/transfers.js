(function() {
    var module = angular.module('transfersModule', ['bytesFilter', 'datesFilter']);

    module.controller('transfersController', ['$scope', '$route', 'putio', '$interval', '$rootScope',
        function($scope, $route, putio, $interval, $rootScope) {

            $scope.loading = true;
            $scope.transfers = [];
            $scope.cancel = {};

            putio.transfers_list(function(err, data) {
                $scope.loading = false;
                $scope.transfers = data.transfers;
            });

            var reload = $interval(function() {
                $scope.loading = true;
                putio.transfers_list(function(err, data) {
                    $scope.loading = false;
                    $scope.transfers = data.transfers;
                });
            }, 5000);

            $scope.$on('$destroy', function() {
                $interval.cancel(reload);
                reload = undefined;
            });

            $scope.transfers_clean = function() {
                wp.event(module, 'transfers', 'clean');

                putio.transfers_clean(function() {
                    $route.reload();
                });
            };

            $scope.maybe_cancel_transfer = function(transfer) {
                wp.event(module, 'transfers', 'maybe_cancel');

                $scope.cancel = transfer;
                $('#transfer_cancel').modal('show');
            };

            $scope.cancel_transfer = function(id) {
                wp.event(module, 'transfers', 'cancel');

                $('#transfer_cancel').modal('hide');
                putio.transfers_cancel(id, function() {
                    $rootScope.$broadcast('transfers_count.refresh');
                    $route.reload();
                });
            };
        }
    ]);
})();