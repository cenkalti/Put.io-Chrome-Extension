(function() {
    var module = angular.module('libraryModule', ['logFactory', 'moviedbService', 'objectFilter', 'stringFilter', 'datesFilter', 'libraryService']);

    module.controller('libraryController', ['$scope', 'putio', 'log', 'moviedb', '$filter', 'library',
        function($scope, putio, Log, moviedb, $filter, library) {
            var log = new Log(module);

            ga('send', 'pageview', '/library');

            $scope.library = {
                "shows": {},
                "movies": {},
                "unknown": {}
            };
            $scope.seleted_show = {};
            $scope.moviedb_configs = moviedb.configs;
            $scope.loading = true;


            crawl(function() {
                $scope.get_library_update();
                $scope.loading = false;
            });

            function crawl(callback) {
                library.local.get(function(data) {
                    if (_.isEmpty(data)) {
                        library.get(0, function(data) {
                            add_to_lib(data, callback);
                        });
                    } else {
                        $scope.$apply(function() {
                            add_to_lib(data, callback);
                        });

                    }
                });
            }

            $scope.play_show = function(episodes) {
                $scope.seleted_show = episodes;
                $("#play_show").modal("show");
            };

            $scope.play = function(file_id) {
                ga('send', 'event', 'library', 'play');

                chrome.windows.create({
                    "url": "video.html#?file=" + file_id,
                    "type": "panel"
                }, function(new_window) {
                    $("#play_show").modal("hide");
                });
            };

            $scope.reset = function() {
                ga('send', 'event', 'library', 'reset');

                $scope.loading = true;
                $scope.library = {
                    "shows": {},
                    "movies": {},
                    "unknown": {}
                };

                library.local.set({}, function() {
                    crawl(function() {
                        $scope.get_library_update();
                        $scope.loading = false;
                    });
                });
            };

            $scope.get_library_update = function() {
                library.local.get_update(function(data) {
                    $scope.$apply(function() {
                        $scope.library_update = data;
                    });
                });
            };

            function add_to_lib(data, callback) {
                async.forEachOf(
                    data,
                    function(item, key, cb) {
                        switch (item.type) {
                            case "tv":
                                if (!$scope.library.shows[item.title]) {
                                    $scope.library.shows[item.title] = item;
                                    $scope.library.shows[item.title].episodes = [];
                                }
                                $scope.library.shows[item.title].episodes.push(item);
                                break;
                            case "movie":
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