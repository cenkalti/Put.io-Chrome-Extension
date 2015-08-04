(function() {
    var module = angular.module('libraryFactory', ['logFactory', 'putioService', 'moviedbService', 'storageFactory']);

    module.factory('library', ['log', '$http', 'putio', 'moviedb', 'storage',

        function(Log, $http, putio, moviedb, Storage) {
            var log = new Log(module),
                storage = new Storage('local');

            var library = function() {
                var self = this;

                self.process = {
                    putio: 0,
                    moviedb: 0,
                    started: 0,
                    ended: 0
                };

                return self;
            };

            library.prototype.get_videos = function(parent_id, callback) {
                var self = this;

                self.process.started = moment();
                self.process.putio = 0;
                self.process.moviedb = 0;

                self.local.get(function(data) {
                    if (!_.isEmpty(data)) {
                        log.debug('got data from local');

                        self.process.ended = moment();
                        self.process.putio = 100;
                        self.process.moviedb = 100;

                        callback(data);
                    } else {
                        log.debug('requesting data');

                        self.reset(parent_id, callback);
                    }
                });

                return self;
            };

            library.prototype.add_videos = function(parent_id, callback) {
                var self = this;

                self.local.get(function(data) {
                    if (_.isEmpty(data)) data = {};

                    self.crawl_directory(parent_id, function(err, files) {
                        self.get_info(files, function(err, videos) {
                            var new_lib = $.extend({}, data, videos);

                            self.local.set(new_lib, function() {
                                callback(new_lib);
                            });
                        });
                    });
                });

                return self;
            };

            library.prototype.reset = function(parent_id, callback) {
                var self = this;

                self.process.started = moment();
                self.process.putio = 0;
                self.process.moviedb = 0;

                self.crawl_directory(parent_id, function(err, files) {
                    self.process.putio = 100;

                    self.get_info(files, function(err, videos) {
                        self.local.set(videos, function() {
                            self.process.ended = moment();
                            self.process.moviedb = 100;
                            callback(videos);
                        });
                    });
                });

                return self;
            };

            library.prototype.local = {
                get: function(callback) {
                    storage.get('library', callback);
                },
                get_update: function(callback) {
                    storage.get('library_update', function(data) {
                        if (data) {
                            callback(data);
                        } else {
                            callback(moment().toISOString());
                        }
                    });
                },
                set: function(data, callback) {
                    storage.set('library', data, function() {
                        storage.set('library_update', moment().toISOString(), callback);
                    });
                }
            };

            library.prototype.crawl_directory = function(parent_id, callback) {
                var self = this;

                function crawled() {
                    if (self.process.putio < 10) {
                        self.process.putio++;
                    }

                    if(self.process.putio >= 10 && self.process.putio < 50) {
                        self.process.putio += 1/3;
                    }

                    if(self.process.putio >= 50 && self.process.putio < 99) {
                        self.process.putio += 1/4;
                    }
                }

                async.waterfall([
                        function(cb) {
                            putio.files_list(parent_id, cb);
                        },
                        function(data, cb) {
                            var videos = [],
                                files = data.files;

                            async.eachSeries(
                                data.files,
                                function(file, fn) {
                                    crawled();
                                    if (is_dir(file)) {
                                        self.crawl_directory(file.id, function(err, data) {
                                            if (!err) videos = videos.concat(data);
                                            fn();
                                        });
                                    } else {
                                        if (is_video(file)) {
                                            videos.push(file);
                                        }
                                        fn();
                                    }
                                },
                                function() {
                                    cb(null, videos);
                                }
                            );
                        }
                    ],
                    function(err, videos) {
                        if (err) {
                            if (err.error_message === 'Parent is not a folder') {
                                putio.file(parent_id, function(err, data) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        if (is_video(data.file)) {
                                            callback(null, [data.file]);
                                        } else {
                                            callback(null, []);
                                        }
                                    }

                                });
                            } else {
                                callback(err);
                            }
                        } else {
                            callback(null, videos);
                        }
                    });
            };

            library.prototype.get_info = function(files, callback) {
                var self = this,
                    videos = {},
                    total = files.length,
                    executed = 0,
                    q = async.queue(exec, 2);

                function exec(file, cb) {
                    moviedb.detect(file.name, function(err, data) {
                        if (err) {
                            data = {
                                file_name: file.name,
                                file_id: file.id,
                                moviedb: false
                            };
                        } else {
                            data.file_name = file.name;
                            data.file_id = file.id;
                        }

                        videos[file.id] = data;
                        executed++;

                        setTimeout(function() {
                            self.process.moviedb = (executed * 100) / total;
                            cb();
                        }, 1000);
                    });
                }

                q.push(files);

                q.drain = function() {
                    callback(null, videos);
                };
            };

            function is_video(file) {
                return putio.is_video(file.content_type);
            }

            function is_dir(file) {
                return file.content_type === "application/x-directory" && file.name !== "items shared with you";
            }

            return library;
        }
    ]);
})();