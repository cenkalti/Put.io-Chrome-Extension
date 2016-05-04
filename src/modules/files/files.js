(function() {
    var module = angular.module('filesModule', ['bytesFilter', 'datesFilter', 'stringFilter', 'treeModule']);

    module.config([
        '$compileProvider',
        function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        }
    ]);

    module.controller('filesController', ['$scope', '$routeParams', '$location', '$route', '$filter', '$timeout', 'putio', '$rootScope',
        function($scope, $routeParams, $location, $route, $filter, $timeout, putio, $rootScope) {
            var parent_id = $routeParams.parent_id || 0,
                $files = $('.files');

            $scope.files = [];
            $scope.selected_files = [];
            $scope.loading = true;
            $scope.folder = {};
            $scope.moveFileId = null;
            $scope.order = 'name';
            $scope.order_reverse = false;
            $scope.modalOptions = {
                title: 'Files',
                saveBtn: {
                    text: 'Move',
                    disabled: true
                }
            };

            putio.files_list(parent_id, function(err, data) {
                if (err) {
                    if (err.error_message === 'Parent is not a folder') {
                        $location.path('/file/' + parent_id);
                    }
                } else {
                    var files = data.files,
                        parent = data.parent;

                    $scope.files = files;
                    $scope.parent = parent;
                    $scope.loading = false;
                }

            });

            $scope.is_video = function(file) {
                return putio.is_video(file.content_type);
            }

            $scope.go_to = function(file) {
                if (putio.is_video(file.content_type)) {
                    wp.event(module, 'files', 'play');

                    chrome.windows.create({
                        url: 'video.html#?file=' + file.id,
                        type: 'panel'
                    }, function(new_window) {});
                } else {
                    $location.path('/file/' + file.id);
                }
            }

            $scope.set_order = function(order, reverse) {
                wp.event(module, 'files', 'order', order);

                if ($scope.order === order) {
                    $scope.order_reverse = !$scope.order_reverse;
                } else {
                    $scope.order = order;
                    $scope.order_reverse = reverse;
                }
            };

            $scope.toggle_select = function(file_id) {
                var $checkAll = $('.check-all', $files),
                    idx = $scope.selected_files.indexOf(file_id);

                if (idx > -1) {
                    $scope.selected_files.splice(idx, 1);
                    $checkAll.prop('indeterminate', true);
                } else {
                    $scope.selected_files.push(file_id);
                    if ($scope.files.length == $scope.selected_files.length) {
                        $checkAll.prop('indeterminate', false);
                        $checkAll.prop('checked', true);
                    } else {
                        $checkAll.prop('indeterminate', true);
                    }
                }

                if ($scope.selected_files.length === 0) {
                    $checkAll.prop('indeterminate', false);
                    $checkAll.prop('checked', false);
                }
            };

            $scope.toggle_select_all = function() {
                var $checkAll = $('.check-all', $files),
                    $checks = $('.check', $files);

                $scope.selected_files = [];

                if ($checkAll.prop('checked')) {
                    $checks.prop('checked', true);
                    for (var i in $scope.files) {
                        var id = $scope.files[i].id;
                        $scope.selected_files.push(id);
                    }
                } else {
                    $checks.prop('checked', false);
                }
            };

            $scope.maybe_rename_folder = function(id, name) {
                wp.event(module, 'files', 'maybe_rename');

                $scope.folder = {};
                $('#rename_folder').modal('show');
                $scope.folder.name = name;
                $scope.folder.id = id;
            };

            $scope.rename_folder = function() {
                wp.event(module, 'files', 'rename');

                $('#rename_folder').modal('hide');
                putio.file_rename($scope.folder.id, $scope.folder.name, function(err, data) {
                    $route.reload();
                });
            };

            $scope.maybe_create_folder = function(parent_id) {
                wp.event(module, 'files', 'maybe_create');

                $('#create_folder').modal('show');
                $scope.folder = {};
                $scope.folder.parent_id = parent_id;
            };

            $scope.create_folder = function() {
                wp.event(module, 'files', 'create');

                var folder = $scope.folder;

                $('#create_folder').modal('hide');
                putio.folder_create(folder.name, folder.parent_id, function(err, data) {
                    $route.reload();
                });
            };

            $scope.maybe_delete_folders = function() {
                wp.event(module, 'files', 'maybe_delete');

                $scope.folder = {};
                $('#delete_folders').modal('show');
                $scope.folder.id = $scope.selected_files;
                $scope.folder.name = $scope.selected_files.length + ' file(s)/folder(s)';
            };

            $scope.delete_folders = function(id) {
                wp.event(module, 'files', 'delete');

                $('#delete_folders').modal('hide');
                putio.files_delete(id, function(err, data) {
                    $rootScope.$broadcast('info.refresh');
                    $route.reload();
                });
            };

            $scope.download_folders = function() {
                wp.event(module, 'files', 'download');

                putio.zips_create($scope.selected_files, function(err, data) {
                    var url = false;

                    async.until(
                        function() {
                            return url !== false;
                        },
                        function(callback) {
                            putio.zips_get(data.zip_id, function(err1, data1) {
                                url = data1.url;
                                callback(err1);
                            });
                        },
                        function(err, n) {
                            chrome.downloads.download({
                                url: url,
                                saveAs: true,
                            }, function(downloadId) {});
                        }
                    );
                });
            };

            $scope.download_url = function(id) {
                return putio.download_url(id);
            };

            $scope.move_selected = function(node) {
                if (node.content_type == 'application/x-directory') {
                    $scope.modalOptions.saveBtn.disabled = false;
                    $scope.modalOptions.saveBtn.text = 'Move to: ' + $filter('limitTo')(node.name, 25);
                } else {
                    $scope.modalOptions.saveBtn.text = 'Nope Nope Nope';
                    $scope.modalOptions.saveBtn.disabled = true;
                }
            };

            $scope.maybe_move_folders = function() {
                wp.event(module, 'files', 'maybe_move');

                $scope.moveFileId = $scope.selected_files;
                $('.tree').modal('show');
            };

            $scope.move = function(node) {
                wp.event(module, 'files', 'move');

                $('.tree').modal('hide');
                putio.files_move($scope.moveFileId, node.id, function(err, data) {
                    $location.path('/files/' + node.id);
                });
            };

        }
    ]);
})();