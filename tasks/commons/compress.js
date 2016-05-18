module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.config.set('compress', {
        package: {
            options: {
                archive: 'packages/<%= pkg.short_name %>-<%= pkg.version %>.zip'
            },
            files: [{
                expand: false,
                src: ['build/**'],
                dest: '/'
            }]
        }
    });
};