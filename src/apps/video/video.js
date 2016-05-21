(function() {
    var module = angular.module('videoApp', ['putioService', 'moviedbService', 'logFactory', 'stringFilter']);

    module.config([
        '$compileProvider',
        '$sceDelegateProvider',
        function($compileProvider, $sceDelegateProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
        }
    ]);

    module.controller('videoController', ['$scope', '$location', 'putio', 'moviedb', 'Log', '$filter',
        function($scope, $location, putio, moviedb, Log, $filter) {
            var params = $location.search(),
                log = new Log(module);

            $scope.loading = true;
            document.title = 'Loading...';
            $scope.config = moviedb.configs;
            $scope.info = {};
            $scope.error = null;

            putio.auth(function() {

                async.parallel({
                        file: function(cb) {
                            putio.stream(params.file, function(err, data) {
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
                            $scope.loading = false;
                            $scope.error = err;
                        } else {
                            var file = results.file,
                                subtitles = results.subtitles;

                            moviedb.detect(file.name, function(err1, data) {
                                $scope.info = data;

                                new videojs('video_player', {
                                    width: '100%',
                                    height: '100%',
                                    controls: true,
                                    preload: 'auto',
                                    poster: get_poster(file.screenshot),
                                    sources: [{
                                        type: 'video/mp4',
                                        src: file.stream_url
                                    }]
                                }, function() {
                                    add_subs(subtitles);

                                    if (err1) {
                                        log.warn(err1);
                                        document.title = file.name;
                                    } else {
                                        document.title = get_title(data);
                                    }

                                    $scope.$apply(function() {
                                        $scope.loading = false;
                                    });
                                });
                            });
                        }

                    });
            });

            function get_poster(screenshot) {
                if ($scope.info && $scope.info.type) {
                    switch ($scope.info.type) {
                        case 'movie':
                            return $scope.config.images.base_url + 'w1280' + $scope.info.backdrop;
                        case 'tv':
                            return $scope.config.images.base_url + 'w1280' + $scope.info.backdrop;
                        default:
                            return screenshot;
                    }
                } else {
                    return screenshot;
                }
            }

            function get_title(info) {
                if (info.type === 'tv') {
                    return info.title + ' Season ' + $filter('pad')(info.season) + ' Episode ' + $filter('pad')(info.episode_number) + ' : ' + info.episode_title;
                } else {
                    return info.title;
                }
            }

            function add_subs(subtitles) {
                var langs = {};

                for (var i in subtitles) {
                    var src = putio.subtitle_url(params.file, subtitles[i].key),
                        source = subtitles[i].source,
                        language = subtitles[i].language || 'unknown';

                    if (typeof langs[language] === 'number') {
                        langs[language] = langs[language] + 1;
                        language = language + ' ' + langs[language];
                    } else {
                        langs[language] = 0;
                    }

                    $('#video_player_html5_api')
                        .append('<track kind="subtitles" src="' + src + '" srclang="' + source + '" label="' + language + '">');
                }
            }
        }
    ]);

})();