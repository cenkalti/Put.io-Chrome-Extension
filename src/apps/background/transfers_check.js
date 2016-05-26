(function() {
    var module = angular.module('transfersCheckService', ['logFactory', 'datesFilter', 'moviedbService', 'stringFilter', 'storageFactory', 'libraryFactory']);

    module.service('transfersCheck', ['$interval', '$timeout', '$filter', 'moviedb', 'Storage', 'Library', 'Log',
        function($interval, $timeout, $filter, moviedb, Storage, Library, Log) {

            var storage = new Storage('local'),
                transfersCheck = this,
                notif = chrome.notifications,
                interval = null,
                cleanInterval = 0,
                library = new Library(),
                putio = null,
                log = new Log(module);

            transfersCheck.start = function(p) {
                log.debug('started transfers checks');
                putio = p;
                checks();
                interval = $interval(checks, 60000);
            };

            transfersCheck.stop = function() {
                if (interval) {
                    $interval.cancel(interval);
                    log.debug('stopped transfers checks');
                }
            };

            function checks() {
                checks_transfers(function(data) {
                    maybe_clean(data);
                });
            }

            function checks_transfers(callback) {
                log.info('checking transfers');

                putio.transfers_list(function(err, data) {
                    if (err || !data.transfers) {
                        log.error(err, data.transfers);
                        callback();
                    } else {

                        async.eachSeries(data.transfers, function(transfer, cb) {
                            var id = transfer.id;

                            get_transfer(id, function(found) {
                                var tr = transfer;

                                if (found) {
                                    tr = $.extend({}, found, transfer);
                                }
                                set_transfer(tr, function() {
                                    maybe_send_notification(tr, cb);
                                });
                            });
                        }, function() {
                            callback(data.transfers);
                        });

                    }
                });
            }

            function maybe_send_notification(transfer, callback) {
                var completed = is_complete(transfer),
                    done = $filter('date_print')(transfer.finished_at),
                    name = $filter('limitTo')(transfer.name, 40),
                    options = {
                        type: 'basic',
                        iconUrl: 'img/icon48.png',
                        title: 'Transfer complete',
                        message: name,
                        contextMessage: ' Completed on ' + done
                    };

                if (completed && !transfer.notified) {
                    log.debug(name + 'completed');

                    moviedb.detect(transfer.name, function(err, data) {
                        if (!err && data.title) {
                            options.type = 'image';
                            options.message = get_title(data);
                            options.imageUrl = 'http://image.tmdb.org/t/p/w154' + data.poster;
                        }
                        notif.create('', options, function(notifId) {
                            transfer.notified = true;

                            set_transfer(transfer, function() {
                                callback();
                            });

                            maybe_add_to_library(transfer);

                            $timeout(function() {
                                notif.clear(notifId, function() {});
                            }, 20000);
                        });
                    });
                } else {
                    log.debug(name + 'completion: ' + transfer.percent_done+ '%, notified: ' + transfer.notified);
                    callback();
                }

            }

            function maybe_add_to_library(transfer) {
                library.add(transfer.file_id, function() {});
            }

            function get_title(info) {
                if (info.type === 'tv') {
                    return 'S' + $filter('pad')(info.season) + 'E' + $filter('pad')(info.episode_number) + ' : ' + info.episode_title;
                } else {
                    return info.title;
                }
            }

            function maybe_clean(data) {
                if (!data) {
                    data = [];
                }

                if (cleanInterval === 10) {
                    log.info('cleaning transfers');

                    get_transfers(function(transfers) {
                        async.forEachOfSeries(transfers, function(transfer, id, cb) {
                            var name = $filter('limitTo')(transfer.name, 40),
                                found = _.findWhere(data, {
                                    id: transfer.id
                                });

                            if (found) {
                                log.debug(name + 'is still there');
                                cb();
                            } else {
                                delete_transfer(id, function() {
                                    log.debug(name + 'is not there anymore, removing');
                                    cb();
                                });

                            }
                        }, function() {
                            cleanInterval = 0;
                        });
                    });
                } else {
                    cleanInterval += 1;
                }
            }

            function is_complete(transfer) {
                return transfer.percent_done == 100 || transfer.status == 'COMPLETED';
            }

            function get_transfers(callback) {
                storage.get('transfers', callback);
            }

            function get_transfer(id, callback) {
                storage.get('transfers', function(data) {
                    if (data && data[id]) {
                        callback(data[id]);
                    } else {
                        callback(null);
                    }
                });
            }

            function set_transfer(transfer, callback) {
                storage.get('transfers', function(data) {
                    if (_.isEmpty(data)) {
                        data = {};
                    }

                    data[transfer.id] = transfer;

                    storage.set('transfers', data, callback);
                });
            }

            function delete_transfer(id, callback) {
                storage.get('transfers', function(data) {
                    if (data && data[id]) {
                        delete data[id];
                    }
                    storage.set('transfers', data, callback);
                });
            }

        }
    ]);
})();