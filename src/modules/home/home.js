(function() {
    var module = angular.module('homeModule', ['datesFilter', 'demoModule', 'ui.bootstrap']);

    module.controller('homeController', ['$scope', '$location', 'putio', '$http',
        function($scope, $location, putio, $http) {

            ga('send', 'pageview', '/home');

            $scope.today_events = [];
            $scope.week_events = [];
            $scope.month_events = [];

            $scope.fileSelected = null;

            $scope.search = {
                selected: null,
                do: function(val) {
                    return $http.get(putio.searchUrl(val, 1), {}).then(function(resp) {
                        return resp.data.files;
                    });
                },
                select: function(file, model, label, event) {
                    if (putio.is_video(file.content_type)) {
                        chrome.windows.create({
                            url: 'video.html#?file=' + file.id,
                            type: 'panel'
                        }, function(new_window) {});
                    } else {
                        $location.path('/file/' + file.id);
                    }

                }
            };

            $scope.demo = {
                config: [{
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
                    selector: '.home > div:nth-child(2) a:first-child',
                    heading: 'Go to file',
                    text: 'Click to go to file/directory.',
                    placement: 'bottom',
                    scroll: true
                }],
                skip: function() {
                    ga('send', 'event', 'home', 'demo_skip');
                },
                finish: function() {
                    ga('send', 'event', 'home', 'demo_finish');
                }
            };

            putio.events_list(function(err, data) {
                var events = data.events;

                var day = moment().subtract(1, 'days'),
                    week = moment().subtract(1, 'weeks'),
                    month = moment().subtract(1, 'months');

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