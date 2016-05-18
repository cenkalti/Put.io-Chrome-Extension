module.exports = function(grunt) {
    grunt.registerTask('build_dev', [
        'clean:all',
        'jshint:before_concat',
        'config:dev',
        'copy:fonts',
        'copy:images',
        'copy:directives',
        'copy:main',
        'concat',
        'bower_concat',
        'less',
        'cssmin',
        'jshint:after_concat',
        'copy:dev',
        'clean:non_minified'
    ]);
};