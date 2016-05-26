module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-bower-concat');

    grunt.config.set('bower_concat', {
        main: {
            dest: 'build/js/index-bower.js',
            exclude: [
                'video.js'
            ],
            dependencies: {
                'angular': 'jquery',
                'angular-route': 'angular',
                'ng-underscore': 'angular',
                'angular-loading-bar': 'angular',
                'bootstrap': 'jquery',
                'angular-xeditable': 'angular',
                'angular-tree-control': 'angular',
                'angular-sanitize': 'angular',
                'angular-cookies': 'angular',
                'angular-local-storage': 'angular'
            },
            bowerOptions: {
                relative: false
            }
        },
        background: {
            dest: 'build/js/background-bower.js',
            exclude: [
                'bootstrap',
                'angular-loading-bar',
                'angular-xeditable',
                'angular-tree-control',
                'video.js'
            ],
            dependencies: {
                'angular': 'jquery',
                'ng-underscore': 'angular',
                'angular-cookies': 'angular',
                'angular-local-storage': 'angular'
            },
            bowerOptions: {
                relative: false
            }
        },
        video: {
            dest: 'build/js/video-bower.js',
            exclude: [
                'bootstrap',
                'angular-loading-bar',
                'angular-xeditable',
                'angular-tree-control'
            ],
            dependencies: {
                'angular': 'jquery',
                'angular-cookies': 'angular',
                'angular-local-storage': 'angular',
                'angular-route': 'angular'
            },
            bowerOptions: {
                relative: false
            }
        }
    });
};