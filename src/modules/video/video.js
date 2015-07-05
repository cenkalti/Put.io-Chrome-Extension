(function() {
    var module = angular.module('videoApp', ['putioService', 'moviedbService', 'logFactory', 'stringFilter', 'libraryService']);

    module.config([
        '$compileProvider',
        '$sceDelegateProvider',
        function($compileProvider, $sceDelegateProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
        }
    ]);

    module.controller('videoController', ['$scope', '$location', 'putio', 'moviedb', 'log', '$filter', 'library',
        function($scope, $location, putio, moviedb, Log, $filter, library) {
            var params = $location.search(),
                log = new Log(module);

            ga('send', 'pageview', '/video');

            $scope.loading = true;
            document.title = "Loading...";
            $scope.config = moviedb.configs;
            $scope.info = {};

            putio.auth(function() {
                async.parallel({
                        file: function(cb) {
                            putio.file(params.file, function(err, data) {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, data.file);
                                }
                            });
                        },
                        subtitles: function(cb) {
                            putio.subtitles(params.file, function(err, data) {
                                if (err) {
                                    cb(null, []);
                                } else {
                                    cb(null, data.subtitles);
                                }
                            });
                        }
                    },
                    function(err, results) {
                        if (err) {
                            maybe_remove_from_library(err, params.file);
                            $scope.loading = false;
                            $scope.error = err;
                        } else {
                            var file = results.file,
                                subtitles = results.subtitles;

                            moviedb.detect(file.name, function(err, data) {
                                $scope.info = data;

                                var player = new videojs("video_player", {
                                    "width": "100%",
                                    "height": "100%",
                                    "controls": true,
                                    "poster": get_poster(file.screenshot)
                                }, function() {
                                    var player = this;

                                    player.src({
                                        type: "video/mp4",
                                        src: video_url(file)
                                    });

                                    add_subs(subtitles);

                                    if (err) {
                                        log.warn(err);
                                        $scope.loading = false;
                                        document.title = data.parsed.title;
                                    } else {
                                        $scope.$apply(function() {
                                            $scope.loading = false;
                                        });
                                        document.title = get_title(data);
                                    }
                                });
                            });
                        }

                    });
            });

            function get_poster(screenshot) {
                if ($scope.info && $scope.info.type) {
                    switch ($scope.info.type) {
                        case "movie":
                            return $scope.config.images.base_url + "w1280" + $scope.info.backdrop;
                        case "tv":
                            return $scope.config.images.base_url + "w1280" + $scope.info.backdrop;
                        default:
                            return screenshot;
                    }
                } else {
                    return screenshot;
                }
            }

            function get_title(info) {
                if (info.type === "tv") {
                    return info.title + " Season " + $filter('pad')(info.season) + " Episode " + $filter('pad')(info.episode_number) + " : " + info.episode_title;
                } else {
                    return info.title;
                }
            }

            function video_url(file) {
                var id = file.id;

                if (file.content_type == "video/mp4") {
                    return "https://api.put.io/v2/files/" + id + "/stream";

                } else {
                    return "https://api.put.io/v2/files/" + id + "/mp4/stream?jwt=extension";
                }
            }

            function add_subs(subtitles) {
                var langs = {};

                for (var i in subtitles) {
                    var src = putio.subtitle_url(params.file, subtitles[i].key),
                        source = subtitles[i].source,
                        language = subtitles[i].language || "unknown";

                    if (typeof langs[language] === "number") {
                        langs[language] = langs[language] + 1;
                        language = language + " " + langs[language];
                    } else {
                        langs[language] = 0;
                    }

                    $("#video_player_html5_api")
                        .append('<track kind="subtitles" src="' + src + '" srclang="en" label="' + language + '">');
                }
            }

            function maybe_remove_from_library(err, file) {
                if (err.status_code === 404) {
                    library.local.get(function(data) {
                        if (data[file]) {
                            delete data[file];
                            library.local.set(data, function() {});
                        }
                    });
                } else {
                    log.warning("ignoring unknown error");
                }
            }
        }
    ]);

})();