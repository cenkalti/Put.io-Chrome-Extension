(function() {
    var module = angular.module('homeModule', ['datesFilter']);

    module.controller('homeController', ['$scope', '$location', 'putio',
        function($scope, $location, putio) {

            ga('send', 'pageview', '/home');

            $scope.today_events = [];
            $scope.week_events = [];
            $scope.month_events = [];

            putio.events_list(function(err, data) {
                var events = data.events;

                var day = moment().subtract(1, "days"),
                    week = moment().subtract(1, "weeks"),
                    month = moment().subtract(1, "months");

                for (var i in events) {
                    var ev = events[i],
                        d = moment(ev.created_at);

                    if (d.isAfter(day)) {
                        $scope.today_events.push(ev);
                    }
                    if (d.isAfter(week) && d.isBefore(day)) {
                        $scope.week_events.push(ev);
                    }
                    if (d.isAfter(month) && d.isBefore(week)) {
                        $scope.month_events.push(ev);
                    }

                }
            });
        }
    ]);
})();