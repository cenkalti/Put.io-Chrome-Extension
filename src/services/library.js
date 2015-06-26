(function() {
    var module = angular.module('libraryService', ['logFactory', 'putioService', 'moviedbService', 'storageFactory']);

    module.service('library', ['log', '$http', 'putio', 'moviedb', 'storage',
        function(Log, $http, putio, moviedb, Storage) {
            var self = this,
                log = new Log(module),
                storage = new Storage("local");

            self.get = function(id, callback) {
                var lib = {};

                crawler(id, function() {
                    self.local.get(function(data) {
                        var new_lib = $.extend({}, data, lib);
                        self.local.set(new_lib, function() {
                            callback(new_lib);
                        });
                    });

                });

                function crawler(parent_id, cb) {
                    putio.files_list(parent_id, function(err, data) {
                        var files = [];

                        if (err && err.error_message === "Parent is not a folder") {
                            putio.file(parent_id, function(err1, data1) {
                                files = [data1.file];
                                async.eachSeries(files, crawl_file, cb);
                            });
                        } else {
                            files = data.files;
                            async.eachSeries(files, crawl_file, cb);
                        }
                    });
                }

                function crawl_file(file, cb) {
                    if (file.name !== "items shared with you") {
                        if (file.content_type === "application/x-directory") {
                            crawler(file.id, cb);
                        } else {
                            if (putio.is_video(file.content_type)) {
                                maybe_fetch_from_db(file, function(data) {
                                    lib[file.id] = data;
                                    cb();
                                });
                            } else {
                                cb();
                            }
                        }
                    } else {
                        cb();
                    }
                }

                function maybe_fetch_from_db(file, cb) {
                    var found = self.local.data[file.id];
                    if (found) {
                        cb(found);
                    } else {
                        fetch_from_db(file, cb);
                    }
                }

                function fetch_from_db(file, cb) {
                    moviedb.detect(file.name, function(err, data) {
                        data.file_name = file.name;
                        data.file_id = file.id;

                        self.local.data[file.id] = data;

                        cb(data);
                    });
                }
            };

            self.local = {
                "data": {}
            };

            self.local.get = function(callback) {
                storage.get("library", function(data) {
                    if (!_.isEmpty(data)) {
                        self.local.data = data;
                    }
                    callback(self.local.data);
                });
            };

            self.local.get_update = function(callback) {
                storage.get("library_update", function(data) {
                    if (data) {
                        callback(data);
                    } else {
                        callback(moment().toISOString());
                    }
                });
            };

            self.local.set = function(data, callback) {
                storage.set("library", data, function() {
                    self.local.data = data;
                    storage.set("library_update", moment().toISOString(), callback);
                });
            };

        }
    ]);
})();