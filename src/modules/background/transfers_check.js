(function() {
    var module = angular.module('transfersCheckService', ['logFactory', 'datesFilter', 'moviedbService', 'stringFilter', 'storageFactory', 'libraryFactory']);

    module.service('transfersCheck', ['$interval', '$timeout', '$filter', 'moviedb', 'storage', 'library', 'log',
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
                    console.debug('stopped transfers checks');
                }
            };

            function checks() {
                checks_transfers(function(data) {
                    maybe_clean(data);
                });
            }

            function checks_transfers(callback) {
                console.group('checking transfers %s', $filter('datesPrint')(new Date()));

                putio.transfers_list(function(err, data) {
                    if (err || !data.transfers) {
                        console.error(err, data.transfers);
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
                        }, function(err) {
                            callback(data.transfers);
                            console.groupEnd();
                        });

                    }
                });
            }

            function maybe_send_notification(transfer, callback) {
                var completed = is_complete(transfer),
                    done = $filter('datesPrint')(transfer.finished_at),
                    name = $filter('limitTo')(transfer.name, 40),
                    options = {
                        type: 'basic',
                        iconUrl: 'img/icon48.png',
                        title: 'Transfer complete',
                        message: name,
                        contextMessage: ' Completed on ' + done
                    };

                if (completed && !transfer.notified) {
                    console.debug('%s completed', name);

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
                    console.debug('%s completion: %i %, notified: %s', name, transfer.percent_done, transfer.notified);
                    callback();
                }

            }

            function maybe_add_to_library(transfer) {
                library.add(transfer.file_id, function(err, data) {});
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
                    console.group('cleaning transfers');

                    get_transfers(function(transfers) {
                        async.forEachOfSeries(transfers, function(transfer, id, cb) {
                            var name = $filter('limitTo')(transfer.name, 40),
                                found = _.findWhere(data, {
                                    id: transfer.id
                                });

                            if (found) {
                                console.debug('%s is still there', name);
                                cb();
                            } else {
                                delete_transfer(id, function() {
                                    console.debug('%s is not there anymore, removing', name);
                                    cb();
                                });

                            }
                        }, function(err) {
                            cleanInterval = 0;
                            console.groupEnd();
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