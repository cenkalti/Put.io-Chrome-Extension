module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.config.set('uglify', {
        options: {
            mangle: false,
            banner: '/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        main: {
            files: {
                'build/js/index.min.js': ['build/js/index.js'],
                'build/js/index-bower.min.js': ['build/js/index-bower.js']
            }
        },
        video: {
            files: {
                'build/js/video.min.js': ['build/js/video.js'],
                'build/js/video-bower.min.js': ['build/js/video-bower.js']
            }
        },
        background: {
            files: {
                'build/js/background.min.js': ['build/js/background.js'],
                'build/js/background-bower.min.js': ['build/js/background-bower.js']
            }
        }
    });
};