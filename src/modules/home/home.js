(function() {
    var module = angular.module('homeModule', ['datesFilter', 'ui.bootstrap', 'ngSanitize']);

    module.controller('homeController', ['$scope', '$location', 'putio', '$http', '$route',
        function($scope, $location, putio, $http, $route) {

            $scope.loading = true;
            $scope.today_events = [];
            $scope.today_events = [];
            $scope.week_events = [];
            $scope.month_events = [];
            $scope.fileSelected = null;

            $scope.search = {
                loading: false,
                selected: null,
                filter: true,
                filter_reset: function() {
                    $scope.search.selected = null;
                },
                do: function(val) {
                    wp.event(module, 'search', 'do', val);

                    return $http.get(putio.searchUrl(val, 1), {}).then(function(resp) {
                        if ($scope.search.filter) {
                            return resp.data.files.filter(video_filter).map(video_detect);
                        } else {
                            return resp.data.files.map(video_show);
                        }
                    });
                },
                select: function(file, model, label, event) {
                    if (putio.is_video(file.content_type)) {
                        wp.event(module, 'search', 'play');

                        chrome.windows.create({
                            url: 'video.html#?file=' + file.id,
                            type: 'panel'
                        }, function(new_window) {});
                    } else {
                        wp.event(module, 'search', 'select');

                        $location.path('/file/' + file.id);
                    }
                    $scope.search.selected = null;
                }
            };

            $scope.clear = function() {
                wp.event(module, 'events', 'clear');

                putio.events_delete(function(err, data) {
                    $route.reload();
                });
            };

            $scope.any_events = function() {
                return $scope.today_events.length === 0 &&
                    $scope.week_events.length === 0 &&
                    $scope.month_events.length === 0;
            };

            putio.events_list(function(err, data) {
                var day = moment().subtract(1, 'days'),
                    week = moment().subtract(1, 'weeks'),
                    month = moment().subtract(1, 'months');

                var events = data.events.filter(function(event) {
                    return event.type != "zip_created";
                });

                for (var i in events) {
                    var event = events[i],
                        d = moment(event.created_at);

                    if (d.isAfter(day)) {
                        $scope.today_events.push(event);
                    }
                    if (d.isAfter(week) && d.isBefore(day)) {
                        $scope.week_events.push(event);
                    }
                    if (d.isAfter(month) && d.isBefore(week)) {
                        $scope.month_events.push(event);
                    }
                }

                $scope.loading = false;
            });

            function video_filter(file) {
                return putio.is_video(file.content_type);
            }

            function video_detect(file) {
                var parsed = ptn(file.name),
                    name = file.name;

                file.name = '<i class="fa fa-play"></i> ';
                file.name += parsed.title;

                if (parsed.season && parsed.episode) {
                    file.name += ' S' + parsed.season + 'E' + parsed.episode;
                }

                file.name += '<small>' + name + '</small>';

                return file;
            }

            function video_show(file) {
                if (putio.is_video(file.content_type)) {
                    var parsed = ptn(file.name),
                        name = file.name;

                    file.name = '<i class="fa fa-play"></i> ';
                    file.name += parsed.title;

                    if (parsed.season && parsed.episode) {
                        file.name += ' S' + parsed.season + 'E' + parsed.episode;
                    }

                    file.name += '<small>' + name + '</small>';
                }

                return file;
            }
        }
    ]);
})();