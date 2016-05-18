(function() {
    var module = angular.module('libraryFactory', ['logFactory', 'storageFactory', 'messageFactory', 'putioService', 'moviedbService']);

    module.factory('library', ['log', 'storage', 'message', 'putio', 'moviedb',
        function(Log, Storage, Message, putio, moviedb) {
            var log = new Log(module);

            var library = function() {
                var self = this;

                self.storage = new Storage('library');
                self.msg = new Message();

                return self;
            };

            library.prototype.start_listeners = function() {
                var self = this;

                self.msg.listen('library.crawl', function(id, send) {
                    log.debug('received library.crawl message with id: ', id);

                    self.crawl(id, function() {
                        log.debug('done crawling');
                        send();
                    });
                });

                self.msg.listen('library.check', function(_id, send) {
                    log.debug('received library.check message');

                    self.check(function() {
                        send();
                    });
                });

                return self;
            };

            library.prototype.get = function(id) {
                var self = this,
                    result = null;

                if (id) {
                    result = self.storage.get(id);
                } else {
                    result = self.storage.keys().map(function(key) {
                        return self.storage.get(key);
                    });
                }

                return result;
            };

            library.prototype.remove = function() {
                var self = this;

                self.storage.remove.apply(self.storage, Array.prototype.slice.call(arguments));

                return self;
            };

            library.prototype.clear = function() {
                var self = this;

                if (self.storage.clearAll()) {
                    log.debug("cleared");
                } else {
                    log.warn("failed to clear");
                }

                return self;
            };

            library.prototype.check = function(callback) {
                var self = this;

                async.each(self.storage.keys(), function(key, cb) {
                    putio.file(key, function(err) {
                        if (err) {
                            var video = self.storage.get(key);

                            if (video) {
                                log.debug("removing video: " + video.file_name);
                                self.remove(key);
                            }
                        }
                        cb();
                    });
                }, callback);

                return self;
            };

            library.prototype.add = function(file_id, callback) {
                var self = this;

                async.waterfall([
                    function(cb) {
                        putio.file(file_id, function(err, data) {
                            if (err) {
                                cb(err);
                            } else {
                                cb(null, data.file);
                            }
                        });
                    },
                    function(file, cb) {
                        if (is_video(file)) {
                            cb(null, [file]);
                        } else {
                            if (is_dir(file)) {
                                crawler(file.id, [], cb);
                            } else {
                                cb(null, []);
                            }
                        }
                    },
                    function(files, cb) {
                        async.map(files, function(file, cb1) {
                            detect(file, cb1);
                        }, cb);
                    },
                    function(videos, cb) {
                        videos.forEach(function(video) {
                            self.storage.set(video.file_id, video);
                        });

                        cb(null, videos);
                    }
                ], callback);

                return self;
            };

            library.prototype.crawl = function(parent_id, callback) {
                var self = this;

                async.waterfall([
                    function(cb) {
                        crawler(parent_id, [], cb);
                    },
                    function(files, cb) {
                        async.map(files, function(file, cb1) {
                            detect(file, cb1);
                        }, cb);
                    },
                    function(videos, cb) {
                        if (parent_id === 0) self.clear();

                        videos.forEach(function(video) {
                            self.storage.set(video.file_id, video);
                        });

                        cb(null, videos);
                    }
                ], callback);

                return self;
            };

            function detect(file, callback) {
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
                    callback(null, data);
                });
            }

            function crawler(id, files, callback) {
                putio.files_list(id, function(err, data) {
                    if (!err && data.files.length) {
                        async.each(data.files, function(file, cb) {
                            if (is_video(file)) {
                                files.push(file);
                                cb();
                            } else {
                                if (is_dir(file)) {
                                    crawler(file.id, files, cb);
                                } else {
                                    cb();
                                }
                            }
                        }, function() {
                            callback(err, files);
                        });
                    } else {
                        callback(err, files);
                    }
                });
            }

            function is_video(file) {
                return putio.is_video(file.content_type);
            }

            function is_dir(file) {
                return file.content_type === 'application/x-directory' && file.name !== 'items shared with you';
            }

            return library;
        }
    ]);
})();