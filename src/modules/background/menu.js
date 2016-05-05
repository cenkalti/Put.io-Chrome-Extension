(function() {
    var module = angular.module('menuService', ['logFactory', 'moviedbService', 'stringFilter']);

    module.service('menu', ['$timeout', 'log', 'moviedb',
        function($timeout, Log, moviedb) {
            var menu = this,
                log = new Log(module),
                notif = chrome.notifications;

            menu.display = function(putio) {
                var default_folder = {
                    "id": 0,
                    "name": "Your Files"
                };

                putio.account_settings(function(err, data) {
                    default_folder.id = data.settings.default_download_folder;

                    putio.file(default_folder.id, function(err, data1) {
                        default_folder.name = data1.file.name;

                        chrome.contextMenus.create({
                            "title": "Upload to put.io (" + default_folder.name + ")",
                            "contexts": ["link", "selection"],
                            "onclick": on_click
                        });
                    });

                });

                function on_click(info, tab) {
                    var options = {
                        "type": "basic",
                        "iconUrl": "img/icon48.png",
                        "title": "Transfer added"
                    };

                    putio.transfer_add(info.linkUrl, default_folder.id, function(err, data) {
                        if (err) {
                            log.warn(err.error_message);
                            options.message = err.error_message;

                            notify(options);
                        } else {
                            options.message = data.transfer.name;
                            options.contextMessage = data.transfer.name;

                            moviedb.detect(data.transfer.name, function(err, data) {
                                if (!err && data.title) {
                                    options.type = "image";
                                    options.message = get_title(data);
                                    options.imageUrl = "http://image.tmdb.org/t/p/w154" + data.poster;
                                }
                                notify(options);
                            });
                        }
                    });
                }

                function get_title(info) {
                    if (info.type === "tv") {
                        return "S" + $filter('pad')(info.season) + "E" + $filter('pad')(info.episode_number) + " : " + info.episode_title;
                    } else {
                        return info.title;
                    }
                }

                function notify(options) {
                    notif.create("", options, function(notifId) {
                        $timeout(function() {
                            notif.clear(notifId, function() {});
                        }, 20000);
                    });
                }
            };

        }
    ]);
})();