(function() {
    var module = angular.module('homeModule', ['datesFilter', 'demoModule']);

    module.controller('homeController', ['$scope', '$location', 'putio',
        function($scope, $location, putio) {

            ga('send', 'pageview', '/home');

            $scope.today_events = [];
            $scope.week_events = [];
            $scope.month_events = [];

            $scope.demo = {
                config: [{
                    type: 'element',
                    selector: '.btn-menu',
                    heading: 'Menu',
                    text: 'Here is the menu.',
                    placement: 'right',
                    scroll: true
                }, {
                    type: 'element',
                    selector: '.progress-bar-value',
                    heading: 'Storage',
                    text: 'Here you can find how much data is left in your account.',
                    placement: 'bottom',
                    scroll: true
                }, {
                    type: 'title',
                    heading: 'Home',
                    text: 'The Home page contains an history of your downloads.'
                }, {
                    type: 'element',
                    selector: '.home > div:nth-child(2) a:first-child',
                    heading: 'Go to file',
                    text: 'Click to go to file/directory.',
                    placement: 'bottom',
                    scroll: true
                }],
                skip: function() {
                    ga('send', 'event', 'hoe', 'demo_skip');
                },
                finish: function() {
                    ga('send', 'event', 'hoe', 'demo_finish');
                }
            };

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