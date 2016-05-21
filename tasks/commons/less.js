module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.config.set('less', {
        main: {
            options: {
                paths: 'src/less'
            },
            files: {
                'build/css/index.css': [
                    'src/apps/index/index.less',
                    'src/modules/*/*.less',
                    '!src/modules/video/**'
                ],
            }
        },
        video: {
            options: {
                paths: 'src/less'
            },
            files: {
                'build/css/video.css': 'src/apps/video/**.less'
            }
        }
    });
};