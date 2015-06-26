module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.config.set("clean", {
        "all": "build/*",
        "non_minified": [
            "build/js/*.js",
            "!build/js/*.min.js",
            "build/css/*.css",
            "!build/css/*.min.css"
        ],
        "package": "packages/<%= pkg.short_name %>-<%= pkg.version %>.zip"
    });
};