(function() {
    var module = angular.module('libraryModule', ['logFactory', 'moviedbService', 'objectFilter', 'stringFilter', 'datesFilter', 'libraryFactory', 'messageFactory']);

    module.controller('libraryController', ['$scope', 'putio', 'log', 'moviedb', '$filter', 'library', 'message', '$rootScope',
        function($scope, putio, Log, moviedb, $filter, Library, Message, $rootScope) {
            var log = new Log(module),
                library = new Library()
            message = new Message();

            $scope.videos = {
                shows: {},
                movies: {},
                unknown: {}
            };
            $scope.seleted_show = {};
            $scope.moviedb_configs = moviedb.configs;
            $scope.reseting = false;
            $scope.video = null;

            $scope.reset = function() {
                wp.event(module, 'library', 'reset');

                $scope.reseting = true;
                $scope.videos = {
                    shows: {},
                    movies: {},
                    unknown: {}
                };

                message.send('library.crawl', 0, function() {
                    $scope.$apply(function() {
                        $scope.reseting = false;
                        load_library();
                    });
                });
            };

            $scope.play_show = function(episodes) {
                $scope.seleted_show = episodes;
                $('#play_show').modal('show');
            };

            $scope.play = function(file_id) {
                wp.event(module, 'library', 'play');

                chrome.windows.create({
                    url: 'video.html#?file=' + file_id,
                    type: 'panel'
                }, function(new_window) {
                    $('#play_show').modal('hide');
                });
            };

            $scope.maybe_delete_file = function(video) {
                wp.event(module, 'library', 'maybe_delete');

                $scope.video = video;
                $('#delete_file').modal('show');
            };

            $scope.delete_file = function() {
                wp.event(module, 'library', 'delete');

                var video = $scope.video;

                $('#delete_file').modal('hide');

                putio.files_delete(video.file_id, function(err, data) {
                    switch (video.type) {
                        case 'tv':
                            var list = $scope.videos.shows[video.season].episodes;
                            $scope.videos.shows[video.season].episodes = _.without(list, _.findWhere(list, {
                                file_id: video.file_id
                            }));
                            break;
                        case 'movie':
                            delete $scope.videos.movies[video.file_id];
                            break;
                        default:
                            delete $scope.videos.unknown[video.file_id];
                    }
                    $rootScope.$broadcast('info.refresh');
                    $scope.video = null;
                    library.remove(video.file_id);
                });
            };

            library.check(function() {
                load_library();
                console.log($scope.videos.shows);
            });

            function load_library() {
                library.get().forEach(function(video) {
                    switch (video.type) {
                        case 'tv':
                            if (!$scope.videos.shows[video.title]) {
                                $scope.videos.shows[video.title] = _.pick(video, 'poster', 'title');
                                $scope.videos.shows[video.title].episodes = [];
                            }
                            $scope.videos.shows[video.title].episodes.push(video);
                            break;
                        case 'movie':
                            $scope.videos.movies[video.file_id] = video;
                            break;
                        default:
                            $scope.videos.unknown[video.file_id] = video;
                    }
                });
            }

        }
    ]);
})();