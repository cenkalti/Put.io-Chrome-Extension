module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.config.set('concat', {
        options: {
            banner: '/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today("dd - mm - yyyy") %> */\n',
            separator: '\n'
        },
        main: {
            files: {
                'build/js/index.js': [
                    'tmp/*.js',
                    'src/filters/*.js',
                    'src/factories/*.js',
                    'src/services/*.js',
                    'src/modules/*/*.js',
                    '!src/modules/video/**',
                    'src/apps/index/index.js'
                ]
            }
        },
        background: {
            files: {
                'build/js/background.js': [
                    'tmp/*.js',
                    'src/filters/*.js',
                    'src/factories/*.js',
                    'src/services/*.js',
                    'src/apps/background/*.js'
                ]
            }
        },
        video: {
            files: {
                'build/js/video.js': [
                    'tmp/*.js',
                    'src/filters/*.js',
                    'src/factories/*.js',
                    'src/services/*.js',
                    'src/apps/video/*.js'
                ]
            }
        }
    });
};