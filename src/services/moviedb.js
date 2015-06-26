(function() {
    var module = angular.module('moviedbService', ['logFactory', 'configModule']);

    module.service('moviedb', ['log', '$http', 'MOVIED_DB_KEY',
        function(Log, $http, MOVIED_DB_KEY) {
            var moviedb = this,
                log = new Log(module),
                baseUrl = "https://api.themoviedb.org/3";

            moviedb.configs = {
                "images": {
                    "base_url": "http://image.tmdb.org/t/p/",
                    "secure_base_url": "https://image.tmdb.org/t/p/",
                    "backdrop_sizes": ["w300", "w780", "w1280", "original"],
                    "logo_sizes": ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
                    "poster_sizes": ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
                    "profile_sizes": ["w45", "w185", "h632", "original"],
                    "still_sizes": ["w92", "w185", "w300", "original"]
                },
                "change_keys": ["adult", "air_date", "also_known_as", "alternative_titles", "biography", "birthday", "budget", "cast", "certifications", "character_names", "created_by", "crew", "deathday", "episode", "episode_number", "episode_run_time", "freebase_id", "freebase_mid", "general", "genres", "guest_stars", "homepage", "images", "imdb_id", "languages", "name", "network", "origin_country", "original_name", "original_title", "overview", "parts", "place_of_birth", "plot_keywords", "production_code", "production_companies", "production_countries", "releases", "revenue", "runtime", "season", "season_number", "season_regular", "spoken_languages", "status", "tagline", "title", "translations", "tvdb_id", "tvrage_id", "type", "video", "videos"]
            };

            moviedb.detect = function(query, callback) {
                async.waterfall([
                    function(cb) {
                        cb(null, {
                            "parsed": ptn(query),
                        });
                    },
                    function(info, cb) {
                        moviedb.search(info.parsed.title, function(err, data) {
                            if (data.results[0]) {
                                info.video = data.results[0];
                                cb(err, info);
                            } else {
                                cb("no video found", info);
                            }
                        });
                    },
                    function(info, cb) {
                        if (info.video.media_type === "tv") {
                            moviedb.tv_episode(
                                info.video.id,
                                info.parsed.season,
                                info.parsed.episode,
                                function(err, data) {
                                    info.episode = data;
                                    cb(err, info);
                                }
                            );
                        } else {
                            cb(null, info);
                        }
                    },
                    function(info, cb) {
                        var data = {
                            "title": info.video.title,
                            "quality": info.parsed.quality,
                            "resolution": info.parsed.resolution,
                            "poster": info.video.poster_path,
                            "backdrop": info.video.backdrop_path,
                            "type": info.video.media_type,
                            "vote_average": info.video.vote_average,
                            "vote_count": info.video.vote_count,
                            "overview": info.video.overview
                        };

                        if(data.type === "tv") {
                            data.title = info.video.name;
                            data.overview = info.episode.overview;
                            data.episode_vote_average = info.episode.vote_average;
                            data.episode_vote_count = info.episode.vote_count;
                            data.episode_number = info.parsed.episode;
                            data.season = info.parsed.season;
                            data.episode_title = info.episode.name;
                        }

                        cb(null, data);
                    }
                ], callback);
            };

            moviedb.search = function(query, callback) {
                request({
                    "verb": "GET",
                    "url": "/search/multi?query=" + query
                }, callback);
            };

            moviedb.config = function(callback) {
                request({
                    "verb": "GET",
                    "url": "/configuration"
                }, callback);
            };

            moviedb.tv = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/tv/" + id
                }, callback);
            };

            moviedb.tv_episode = function(id, season, episode, callback) {
                request({
                    "verb": "GET",
                    "url": "/tv/" + id + "/season/" + season + "/episode/" + episode
                }, callback);
            };

            moviedb.movie = function(id, callback) {
                request({
                    "verb": "GET",
                    "url": "/movie/" + id
                }, callback);
            };

            function request(options, callback) {
                var config = {
                    "method": options.verb,
                    "url": get_url(options.url),
                    "data": options.data,
                    "headers": {
                        "Accept": "application/json"
                    }
                };

                if (options.data === undefined || options.data === null) {
                    delete config.data;
                }

                $http(config)
                    .success(function(data, status, headers, config) {
                        callback(null, data);
                    }).error(function(data, status, headers, config) {
                        callback(data, null);
                    });
            }

            function get_url(url) {
                if (url.match(/\?/g)) {
                    return baseUrl + url + "&api_key=" + MOVIED_DB_KEY;
                } else {
                    return baseUrl + url + "?api_key=" + MOVIED_DB_KEY;
                }
            }
        }
    ]);
})();