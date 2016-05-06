module.exports = function(grunt) {
    grunt.registerTask("build_dev", [
        "clean:all",
        "config:dev",
        "copy:fonts",
        "copy:images",
        "copy:directives",
        "copy:main",
        "jshint:before_concat",
        "concat",
        "bower_concat",
        "less",
        "cssmin",
        "jshint:after_concat",
        "copy:dev",
        "clean:non_minified"
    ]);
};