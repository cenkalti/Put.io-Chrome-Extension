module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.config.set('cssmin', {
        options: {
            banner: '/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        main: {
            files: {
                'build/css/index.min.css': [
                    'build/css/index-bower.css',
                    'build/css/index.css'
                ]
            }
        },
        video: {
            files: {
                'build/css/video.min.css': [
                    'build/css/video-bower.css',
                    'build/css/video.css',
                ]
            }
        }
    });
};