(function() {
    var module = angular.module('libraryModule', ['logFactory', 'moviedbService', 'objectFilter', 'stringFilter', 'datesFilter', 'libraryFactory']);

    module.controller('libraryController', ['$scope', 'putio', 'log', 'moviedb', '$filter', 'library',
        function($scope, putio, Log, moviedb, $filter, Library) {
            var log = new Log(module),
                library = new Library(),
                $resetModal = $('.reset-modal');

            ga('send', 'pageview', '/library');

            $scope.library = {
                shows: {},
                movies: {},
                unknown: {}
            };
            $scope.seleted_show = {};
            $scope.moviedb_configs = moviedb.configs;
            $scope.loading = true;
            $scope.process = {
                moviedb: 0,
                putio: 0,
            };

            crawl(function() {
                $scope.get_library_update();
                $scope.loading = false;
            });

            $scope.get_class = function(data) {
                if (data < 50) return 'progress-bar-danger';
                if (data < 80) return 'progress-bar-warning';
                if (data < 100) return 'progress-bar-info';

                return 'progress-bar-success';
            };

            $scope.reset = function() {
                $resetModal.modal('show');

                if (!$scope.loading) {
                    ga('send', 'event', 'library', 'reset');

                    $scope.loading = true;
                    $scope.library = {
                        shows: {},
                        movies: {},
                        unknown: {}
                    };

                    var inter = setInterval(function() {
                        $scope.$apply(function() {
                            $scope.process = library.process;
                        });
                    }, 500);

                    library.reset(0, function(videos) {
                        clearInterval(inter);

                        $scope.process = library.process;

                        add_to_lib(videos, function() {
                            $scope.$apply(function() {
                                $scope.loading = false;
                            });
                            $scope.get_library_update();
                        });
                    });
                }
            };

            $scope.get_library_update = function() {
                library.local.get_update(function(data) {
                    $scope.$apply(function() {
                        $scope.library_update = data;
                    });
                });
            };

            $scope.play_show = function(episodes) {
                $scope.seleted_show = episodes;
                $('#play_show').modal('show');
            };

            $scope.play = function(file_id) {
                ga('send', 'event', 'library', 'play');

                chrome.windows.create({
                    url: 'video.html#?file=' + file_id,
                    type: 'panel'
                }, function(new_window) {
                    $('#play_show').modal('hide');
                });
            };

            function crawl(callback) {
                var inter = setInterval(function() {
                    $resetModal.modal('show');
                    $scope.$apply(function() {
                        $scope.process = library.process;
                    });
                }, 500);

                library.get_videos(0, function(videos) {
                    clearInterval(inter);

                    $scope.process = library.process;

                    add_to_lib(videos, function() {

                        $scope.loading = false;
                        callback();
                    });
                });

            }

            function add_to_lib(data, callback) {
                async.forEachOf(
                    data,
                    function(item, key, cb) {
                        switch (item.type) {
                            case 'tv':
                                if (!$scope.library.shows[item.title]) {
                                    $scope.library.shows[item.title] = item;
                                    $scope.library.shows[item.title].episodes = [];
                                }
                                $scope.library.shows[item.title].episodes.push(item);
                                break;
                            case 'movie':
                                $scope.library.movies[item.title] = item;
                                break;
                            default:
                                $scope.library.unknown[item.file_name] = item;
                        }
                        cb();
                    },
                    callback
                );
            }

        }
    ]);
})();