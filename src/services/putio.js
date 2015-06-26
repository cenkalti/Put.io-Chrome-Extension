(function() {
    var module = angular.module('putioService', ['storageFactory']);

    module.service('putio', ['storage', '$http',
        function(Storage, $http) {

            var putio = this,
                storage = new Storage("sync"),
                baseUrl = "https://api.put.io/v2",
                errorCallback = null,
                accessToken = null,
                askToLog = false;

            putio.set_error_callback = function(callback) {
                errorCallback = callback;
            };

            putio.set_ask_to_log = function(bool) {
                askToLog = bool;
            };

            putio.auth = function(callback) {
                var url = "/oauth2/authenticate?client_id=649&response_type=code&redirect_uri=http://putio.herokuapp.com/putio";

                storage.get('putio', function(putioStorage) {
                    if (putioStorage && putioStorage.access_token) {
                        accessToken = putioStorage.access_token;
                        callback(null, accessToken);
                    } else {
                        if (!putioStorage) {
                            putioStorage = {};
                        }

                        request({
                            "verb": "GET",
                            "url": url
                        }, function(err, data) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (data.access_token) {
                                    accessToken = data.access_token;
                                    putioStorage.access_token = data.access_token;

                                    storage.set("putio", putioStorage, function() {
                                        callback(null, data.access_token);
                                    });
                                } else {
                                    if (askToLog) {
                                        chrome.windows.create({
                                            "url": baseUrl + url,
                                            "type": "panel"
                                        }, function() {});
                                    }
                                    callback(true, null);
                                }
                            }
                        });
                    }
                });
            };

            putio.auth_reset = function(callback) {
                storage.get("putio", function(data) {
                    data.access_token = null;
                    storage.set("putio", data, callback);
                });
            };

            putio.app_reset = function(callback) {
                storage.remove("putio", function(data) {
                    callback();
                });
            };

            putio.options_get = function(callback) {
                storage.get("putio", function(data) {
                    if (data && data.options) {
                        callback(null, data.options);
                    } else {
                        callback(null, {});
                    }
                });
            };

            putio.options_set = function(options, callback) {
                storage.get("putio", function(data) {
                    data.options = options;
                    storage.set("putio", data, function() {
                        callback(null, options);
                    });
                });
            };

            putio.reset_app = function(callback) {
                storage.remove("putio", function(data) {
                    callback();
                });
            };

            putio.account_info = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/account/info"
                }, callback);
            };

            putio.account_settings = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/account/settings"
                }, callback);
            };

            putio.account_set_settings = function(data, callback) {
                request({
                    "verb": "POST",
                    "url": "/account/settings",
                    "data": data
                }, callback);
            };

            putio.files_list = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/files/list?breadcrumbs=1&parent_id=" + id
                }, callback);
            };

            putio.file = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/files/" + id
                }, callback);
            };

            putio.folder_create = function(name, parent_id, callback) {
                request({
                    "verb": "POST",
                    "url": "/files/create-folder",
                    "data": {
                        "name": name,
                        "parent_id": parent_id
                    }
                }, callback);
            };

            putio.files_delete = function(ids, callback) {
                if (typeof ids === "object") {
                    ids = ids.join();
                }

                request({
                    "verb": "POST",
                    "url": "/files/delete",
                    "data": {
                        "file_ids": ids.toString()
                    }
                }, callback);
            };

            putio.files_move = function(ids, parent_id, callback) {
                if (typeof ids === "object") {
                    ids = ids.join();
                }

                request({
                    "verb": "POST",
                    "url": "/files/move",
                    "data": {
                        "file_ids": ids.toString(),
                        "parent_id": parent_id
                    }
                }, callback);
            };

            putio.file_rename = function(id, name, callback) {
                request({
                    "verb": "POST",
                    "url": "/files/rename",
                    "data": {
                        "file_id": id,
                        "name": name
                    }
                }, callback);
            };

            putio.files_download = function(ids, callback) {
                if (typeof ids === "object") {
                    ids = ids.join();
                }

                request({
                    "verb": "GET",
                    "url": "/files/zip?file_ids=" + ids.toString()
                }, callback);
            };

            putio.subtitles = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/files/" + id + "/subtitles"
                }, callback);
            };

            putio.subtitle_url = function(id, key) {
                return baseUrl + "/files/" + id + "/subtitles/" + key + "?format=webvtt";
            };

            putio.download_url = function(ids) {
                var url = baseUrl + "/files";

                if (typeof ids === "object") {
                    url += "/zip?file_ids=" + ids.join() + "&oauth_token=" + accessToken;
                } else {
                    url += "/" + ids + "/download?oauth_token=" + accessToken;
                }

                return url;
            };

            putio.transfers_list = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/transfers/list"
                }, callback);
            };

            putio.transfers_count = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/transfers/count"
                }, callback);
            };

            putio.transfer = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/transfers/" + id
                }, callback);
            };

            putio.transfer_add = function(url, parent_id, callback) {
                request({
                    "verb": "POST",
                    "url": "/transfers/add",
                    "data": {
                        "url": url,
                        "save_parent_id": parent_id
                    }
                }, callback);
            };

            putio.transfers_clean = function(callback) {
                request({
                    "verb": "POST",
                    "url": "/transfers/clean"
                }, callback);
            };

            putio.transfers_cancel = function(ids, callback) {
                request({
                    "verb": "POST",
                    "url": "/transfers/cancel",
                    "data": {
                        "transfer_ids": ids.toString()
                    }
                }, callback);
            };

            putio.events_list = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/events/list"
                }, callback);
            };

            putio.friends_list = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/friends/list"
                }, callback);
            };

            putio.friends_req = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/friends/waiting-requests"
                }, callback);
            };

            putio.friend_approve = function(friend, callback) {
                request({
                    "verb": "POST",
                    "url": "/friends/" + friend + "/approve"
                }, callback);
            };

            putio.friend_deny = function(friend, callback) {
                request({
                    "verb": "POST",
                    "url": "/friends/" + friend + "/deny"
                }, callback);
            };

            putio.friend_unfriend = function(friend, callback) {
                request({
                    "verb": "POST",
                    "url": "/friends/" + friend.name + "/unfriend",
                    "data": {
                        "id": friend.id
                    }
                }, callback);
            };

            putio.mp4_status = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/files/" + id.toString() + "/mp4"
                }, callback);
            };

            putio.mp4_convert = function(id, callback) {
                request({
                    "verb": "POST",
                    "url": "/files/" + id.toString() + "/mp4"
                }, callback);
            };

            putio.is_video = function(content_type) {
                if (content_type.indexOf("video") == -1) {
                    return false;
                } else {
                    return true;
                }
            };

            function request(options, callback) {
                var config = {
                    "method": options.verb,
                    "url": get_url(options.url),
                    "data": options.data,
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }
                };

                if (options.data === undefined || options.data === null) {
                    delete config.data;
                    delete config.transformRequest;
                }

                $http(config)
                    .success(function(data, status, headers, config) {
                        callback(null, data);
                    }).error(function(data, status, headers, config) {
                        if (typeof errorCallback == "function") errorCallback(data);
                        callback(data, null);
                    });
            }

            function get_url(url) {
                if (accessToken) {
                    if (url.match(/\?/g)) {
                        return baseUrl + url + "&oauth_token=" + accessToken;
                    } else {
                        return baseUrl + url + "?oauth_token=" + accessToken;
                    }
                } else {
                    return baseUrl + url;
                }
            }

        }
    ]);
})();