module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.config.set('copy', {
        fonts: {
            files: [{
                expand: true,
                flatten: true,
                src: [
                    'bower_components/bootstrap/dist/fonts/*',
                    'bower_components/video.js/dist/font/*'
                ],
                dest: 'build/fonts/'
            }]
        },
        images: {
            files: [{
                expand: true,
                flatten: true,
                src: [
                    'src/img/*',
                    'bower_components/angular-tree-control/images/*'
                ],
                dest: 'build/img/'
            }]
        },
        directives: {
            files: [{
                expand: true,
                flatten: true,
                src: [
                    'src/modules/commons/*/directives/*.html',
                    'src/modules/*/directives/*.html'
                ],
                dest: 'build/html/'
            }]
        },
        main: {
            files: [{
                expand: true,
                flatten: true,
                src: [
                    'src/apps/index/index.html',
                    'src/apps/background/background.html',
                    'src/apps/video/video.html',
                    'src/manifest.json'
                ],
                dest: 'build/'
            }]
        },
        dev: {
            files: [{
                src: 'build/js/index.js',
                dest: 'build/js/index.min.js'
            }, {
                src: 'build/js/index-bower.js',
                dest: 'build/js/index-bower.min.js'
            }, {
                src: 'build/js/video.js',
                dest: 'build/js/video.min.js'
            }, {
                src: 'build/js/video-bower.js',
                dest: 'build/js/video-bower.min.js'
            }, {
                src: 'build/js/background.js',
                dest: 'build/js/background.min.js'
            }, {
                src: 'build/js/background-bower.js',
                dest: 'build/js/background-bower.min.js'
            }]
        }
    });
};