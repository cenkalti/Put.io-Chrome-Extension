module.exports = function(grunt) {
    grunt.registerTask('build', '', function(version) {
        if (version) {
            grunt.config.set('pkg.version', version);
            grunt.task.run('json-replace:version');
        } else {
            grunt.log.writeln('WARNING: did not update version!');
        }
        grunt.task.run([
            'clean:all',
            'jshint:before_concat',
            'config:prod',
            'copy:fonts',
            'copy:images',
            'copy:directives',
            'copy:main',
            'concat',
            'bower_concat',
            'less',
            'cssmin',
            'jshint:after_concat',
            'uglify',
            'clean:non_minified',
            'clean:package',
            'compress'
        ]);
    });
};