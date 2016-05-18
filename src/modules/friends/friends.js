(function() {
    var module = angular.module('friendsModule', []);

    module.controller('friendsController', ['$scope', '$route', '$rootScope', 'putio',
        function($scope, $route, $rootScope, putio) {

            $scope.friends = [];
            $scope.friendRequests = [];

            putio.friends_list(function(err, data) {
                $scope.friends = data.friends;
            });

            putio.friends_req(function(err, data) {
                $scope.friendRequests = data.friends;
            });

            $scope.friend_approve = function(friend) {
                wp.event(module, 'friends', 'approve');

                putio.friend_approve(friend, function() {
                    $rootScope.$broadcast('friends_req.refresh');
                    $route.reload();
                });
            };

            $scope.friend_deny = function(friend) {
                wp.event(module, 'friends', 'deny');

                putio.friend_deny(friend, function() {
                    $rootScope.$broadcast('friends_req.refresh');
                    $route.reload();
                });
            };

            $scope.friend_unfriend = function(friend) {
                wp.event(module, 'friend', 'unfriend');

                putio.friend_unfriend(friend, function() {
                    $route.reload();
                });
            };

        }
    ]);
})();