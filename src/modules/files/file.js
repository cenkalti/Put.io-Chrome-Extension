(function() {
    var module = angular.module('fileModule', ['bytesFilter', 'datesFilter', 'xeditable', 'treeModule']);

    module.config([
        '$compileProvider',
        '$sceDelegateProvider',
        function($compileProvider, $sceDelegateProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

            $sceDelegateProvider.resourceUrlWhitelist(['**']);
        }
    ]);

    module.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

    module.controller('fileController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'putio',
        function($scope, $routeParams, $location, $route, $filter, putio) {
            var file_id = $routeParams.file_id;

            ga('send', 'pageview', '/file');

            $scope.file = {};
            $scope.loading = true;
            $scope.moveFileId = null;
            $scope.modalOptions = {
                title: 'Files',
                saveBtn: {
                    text: 'Move',
                    disabled: true
                }
            };

            putio.file(file_id, function(err, data) {
                var file = data.file;

                $scope.file = file;

                putio.files_list(file.parent_id, function(err, data) {
                    var files = data.files,
                        parent = data.parent;

                    $scope.files = files;
                    $scope.parent = parent;

                    $scope.loading = false;
                });

            });

            $scope.maybe_rename_file = function(name) {
                ga('send', 'event', 'file', 'maybe_rename_file');

                $('#rename_file').modal('show');
                $scope.file.name = name;
            };

            $scope.rename_file = function() {
                ga('send', 'event', 'file', 'rename_file');

                $('#rename_file').modal('hide');
                putio.file_rename($scope.file.id, $scope.file.name, function(err, data) {});
            };

            $scope.maybe_delete_file = function() {
                ga('send', 'event', 'file', 'maybe_delete_file');

                $('#delete_file').modal('show');
            };

            $scope.delete_file = function(id, parent_id) {
                ga('send', 'event', 'file', 'delete_file');

                $('#delete_file').modal('hide');
                putio.files_delete(id, function(err, data) {
                    $scope.$root.$broadcast('refresh_file');
                    $location.path('/files/' + parent_id);
                });
            };

            $scope.download_file = function(id) {
                ga('send', 'event', 'file', 'download_file');

                var url = putio.download_url(id);

                chrome.downloads.download({
                    url: url,
                    saveAs: true,
                }, function(downloadId) {});
            };

            $scope.is_video = function(content_type) {
                return putio.is_video(content_type);
            };

            $scope.play = function(file) {
                ga('send', 'event', 'file', 'play');

                chrome.windows.create({
                    url: 'video.html#?file=' + file.id,
                    type: 'panel'
                }, function(new_window) {});
            };

            $scope.selected = function(node) {
                if (node.content_type == 'application/x-directory') {
                    $scope.modalOptions.saveBtn.disabled = false;
                    $scope.modalOptions.saveBtn.text = 'Move to: ' + $filter('limitTo')(node.name, 25);
                } else {
                    $scope.modalOptions.saveBtn.text = 'Nope Nope Nope';
                    $scope.modalOptions.saveBtn.disabled = true;
                }
            };

            $scope.maybe_move_file = function() {
                ga('send', 'event', 'file', 'maybe_move_file');

                $scope.moveFileId = $scope.file.id;
                $('.tree').modal('show');
            };

            $scope.move = function(node) {
                ga('send', 'event', 'file', 'move');

                $('.tree').modal('hide');
                putio.files_move($scope.moveFileId, node.id, function(err, data) {
                    $location.path('/files/' + node.id);
                });
            };

        }
    ]);
})();