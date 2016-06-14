(function() {
    var module = angular.module('libraryModule', ['moviedbService', 'objectFilter', 'stringFilter', 'datesFilter', 'libraryFactory', 'messageFactory', 'interfaceService', 'ui-notification']);

    module.config([
        'NotificationProvider',
        function(NotificationProvider) {
            NotificationProvider.setOptions({
                startTop: 61
            });
        }
    ]);

    module.controller('libraryController', ['$scope', 'putio', 'moviedb', '$filter', 'Library', 'Message', '$rootScope', 'interface', 'Notification',
        function($scope, putio, moviedb, $filter, Library, Message, $rootScope, interface, notify) {
            var library = new Library(),
                message = new Message();

            $scope.videos = {
                shows: {},
                movies: {},
                unknown: {}
            };
            $scope.seleted_show = {};
            $scope.moviedb_configs = moviedb.configs;
            $scope.loading = false;
            $scope.video = null;

            $scope.reset = function() {
                wp.event(module, 'library', 'reset');

                $scope.loading = true;
                $scope.videos = {
                    shows: {},
                    movies: {},
                    unknown: {}
                };

                notify.info({
                    message: 'Updating library'
                });

                message.send('library.crawl', 0, function() {
                    notify.success({
                        message: 'Library updated',
                        replaceMessage: true
                    });

                    $scope.$apply(function() {
                        $scope.loading = false;
                        load_library();
                    });
                });
            };

            $scope.check = function() {
                wp.event(module, 'library', 'check');

                $scope.loading = true;

                $scope.videos = {
                    shows: {},
                    movies: {},
                    unknown: {}
                };

                library.check(function() {
                    load_library();
                    $scope.loading = false;
                });
            };

            $scope.play_show = function(episodes) {
                $scope.seleted_show = episodes;
                $('#play_show').modal('show');
            };

            $scope.play = function(file_id) {
                wp.event(module, 'library', 'play');

                interface.create_window({
                    url: 'video.html#?file=' + file_id,
                    type: 'panel'
                }, function() {
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

                $('#delete_file').modal('hide');

                var video = $scope.video,
                    ids = video.file_id;

                if (video.type === 'tv') {
                    ids = video.episodes.map(function(episode) {
                        return episode.file_id;
                    });
                }

                putio.files_delete(ids, function() {
                    switch (video.type) {
                        case 'tv':
                            delete $scope.videos.shows[video.title];
                            break;
                        case 'movie':
                            delete $scope.videos.movies[video.file_id];
                            break;
                        default:
                            delete $scope.videos.unknown[video.file_id];
                    }
                    $rootScope.$broadcast('info.refresh');
                    $scope.video = null;
                    library.remove(ids);
                });
            };

            load_library();

            function load_library() {
                library.get().forEach(function(video) {
                    switch (video.type) {
                        case 'tv':
                            if (!$scope.videos.shows[video.title]) {
                                $scope.videos.shows[video.title] = _.pick(video, 'poster', 'title', 'type');
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