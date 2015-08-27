(function() {
    var module = angular.module('treeModule', ['putioService', 'treeControl']);

    module.directive('tree',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'html/tree-directive.html',
                controller: 'treeController',
                scope: {
                    nodeSelected: '&',
                    nodeToggled: '&',
                    success: '&',
                    cancel: '&',
                    modalOptions: '='
                }
            };
        }
    );

    module.controller('treeController', ['$scope', 'putio',
        function($scope, putio) {

            $scope.treeOptions = {
                nodeChildren: 'children',
                dirSelectable: true,
                injectClasses: {
                    iLeaf: 'fa fa-file fa-lg fa-fw',
                    iExpanded : 'fa fa-folder-open fa-lg fa-fw',
                    iCollapsed: 'fa fa-folder fa-lg fa-fw',
                    label: 'tree-label',
                    labelSelected :  'tree-label-selected'
                }
            };

            $('.tree').on('show.bs.modal', function(e) {
                $scope.treeData = [];
                $scope.expandedNodes = [];
                $scope.selectedNode = undefined;
                $scope.loading = true;

                putio.auth(function(err) {
                    putio.files_list(0, function(err, data) {
                        var parent = formatFile(data.parent),
                            files = data.files;

                        parent.children = [];

                        for (var i in files) {
                            var file = formatFile(files[i]);

                            parent.children.push(file);
                        }

                        $scope.loading = false;
                        $scope.treeData.push(parent);
                        $scope.expandedNodes.push(parent);
                    });
                });
            });

            $scope.onSelected = function(node) {
                $scope.nodeSelected({
                    node: node
                });
            };

            $scope.onToggled = function(node, expanded) {
                if (expanded) {
                    putio.files_list(node.id, function(err, data) {
                        var files = data.files;

                        node.children = [];

                        if (files.length === 0) {
                            node.children.push({
                                name: 'Nothing here',
                                children: []
                            });
                        }

                        for (var i in files) {
                            var file = formatFile(files[i]);

                            node.children.push(file);
                        }

                        $scope.nodeToggled({
                            node: node,
                            expanded: expanded
                        });
                    });
                }
            };

            function formatFile(file) {
                if (file.content_type == 'application/x-directory') {
                    file.children = [{
                        name: 'Loading ...',
                        children: []
                    }];
                } else {
                    file.children = [];
                }

                return file;
            }
        }
    ]);
})();