(function() {
    var module = angular.module('friendsModule', []);

    module.controller('friendsController', ['$scope', '$route', 'putio',
        function($scope, $route, putio) {

            ga('send', 'pageview', '/friends');

            $scope.friends = [];
            $scope.friend_requests = [];

            putio.friends_list(function(err, data) {
                $scope.friends = data.friends;
            });

            putio.friends_req(function(err, data) {
                $scope.friend_requests = data.friends;
            });

            $scope.friend_approve = function(friend) {
                ga('send', 'event', 'friends', 'approve');
                putio.friend_approve(friend, function(err, data) {
                    $scope.$root.$broadcast('refresh_friends_req');
                    $route.reload();
                });
            };

            $scope.friend_deny = function(friend) {
                ga('send', 'event', 'friends', 'deny');
                putio.friend_deny(friend, function(err, data) {
                    $scope.$root.$broadcast('refresh_friends_req');
                    $route.reload();
                });
            };

            $scope.friend_unfriend = function(friend) {
                ga('send', 'event', 'friends', 'unfriend');
                putio.friend_unfriend(friend, function(err, data) {
                    $route.reload();
                });
            };

        }
    ]);
})();