(function() {
    var module = angular.module('friendsModule', []);

    module.controller('friendsController', ['$scope', '$route', 'putio',
        function($scope, $route, putio) {

            $scope.friends = [];
            $scope.friend_requests = [];

            putio.friends_list(function(err, data) {
                $scope.friends = data.friends;
            });

            putio.friends_req(function(err, data) {
                $scope.friend_requests = data.friends;
            });

            $scope.friend_approve = function(friend) {
                putio.friend_approve(friend, function(err, data) {
                    $scope.$root.$broadcast("refresh_friends_req");
                    $route.reload();
                });
            };

            $scope.friend_deny = function(friend) {
                putio.friend_deny(friend, function(err, data) {
                    $scope.$root.$broadcast("refresh_friends_req");
                    $route.reload();
                });
            };

            $scope.friend_unfriend = function(friend) {
                putio.friend_unfriend(friend, function(err, data) {
                    $route.reload();
                });
            };

        }
    ]);
})();