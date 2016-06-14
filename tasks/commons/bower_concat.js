module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-bower-concat');

    grunt.config.set('bower_concat', {
        main: {
            dest: {
                js: 'build/js/index-bower.js',
                css: 'build/css/index-bower.css'
            },
            exclude: [
                'video.js'
            ],
            dependencies: {
                'angular': 'jquery',
                'bootstrap': 'jquery',
                'angular-route': 'angular',
                'angular-loading-bar': 'angular',
                'angular-xeditable': 'angular',
                'angular-tree-control': 'angular',
                'angular-sanitize': 'angular',
                'angular-cookies': 'angular',
                'angular-local-storage': 'angular',
                'angular-ui-notification': 'angular'
            },
            mainFiles: {
                'angular': ['angular.js', 'angular-csp.css'],
                'angular-bootstrap': ['ui-bootstrap-tpls.js', 'ui-bootstrap-csp.css']
            },
            process: function(src) {
                var newSrc = '';

                if (src.search(/treecontrol {/) !== -1) {
                    newSrc = src.replace(/ \.\.\/images\/ /, '../img/');
                } else if (src.search(/window\.ptn/) !== -1) {
                    newSrc =
                        src
                        .replace('/(S?([0-9]{1,2}))[Ex]/', '/([Ss]?([0-9]{1,2}))[Eex]/')
                        .replace('/([Ex]([0-9]{2})[^0-9])/', '/([Eex]([0-9]{2})[^0-9])/');
                } else {
                    newSrc = src;
                }

                return newSrc;
            }
        },
        video: {
            dest: {
                js: 'build/js/video-bower.js',
                css: 'build/css/video-bower.css'
            },
            exclude: [
                'angular-bootstrap',
                'angular-cookies',
                'angular-loading-bar',
                'angular-tree-control',
                'angular-xeditable',
                'angular-ui-notification'
            ],
            dependencies: {
                'angular': 'jquery',
                'bootstrap': 'jquery',
                'angular-sanitize': 'angular',
                'angular-local-storage': 'angular'
            },
            mainFiles: {
                'angular': ['angular.js', 'angular-csp.css']
            },
            process: function(src) {
                var newSrc = '';

                if (src.search(/font\/VideoJS\.eot\?#iefix/) !== -1) {
                    newSrc = src.replace(/font\/VideoJS\.eot\?#iefix/, 'fonts/VideoJS.eot?#iefix')
                } else {
                    newSrc = src;
                }

                return newSrc;
            }
        },
        background: {
            dest: 'build/js/background-bower.js',
            exclude: [
                'bootstrap',
                'angular-loading-bar',
                'angular-xeditable',
                'angular-tree-control',
                'video.js',
                'angular-ui-notification'
            ],
            dependencies: {
                'angular': 'jquery',
                'angular-cookies': 'angular',
                'angular-local-storage': 'angular'
            }
        }
    });
};