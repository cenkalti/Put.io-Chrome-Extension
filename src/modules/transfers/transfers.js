(function() {
    var module = angular.module('transfersModule', ['bytesFilter', 'datesFilter']);

    module.controller('transfersController', ['$scope', '$route', 'putio',
        function($scope, $route, putio) {
            $scope.loading = true;
            $scope.transfers = [];

            $scope.cancel = {};

            putio.transfers_list(function(err, data) {
                $scope.loading = false;
                $scope.transfers = data.transfers;
            });

            $scope.transfers_clean = function() {
                putio.transfers_clean(function(err, data) {
                    $route.reload();
                });
            };

            $scope.maybe_cancel_transfer = function(transfer) {
                $scope.cancel = transfer;
                $("#transfer_cancel").modal("show");
            };

            $scope.cancel_transfer = function(id) {
                $("#transfer_cancel").modal("hide");
                putio.transfers_cancel(id, function(err, data) {
                    $scope.$root.$broadcast("refresh_transfers_count");
                    $route.reload();
                });
            };
        }
    ]);
})();