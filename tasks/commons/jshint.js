module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.config.set("jshint", {
        options: {
            // maxerr: 10,
            // maxdepth: 2,
            // maxparams: 4,
            // unused: true,
            // undef: true,
            // node: true,
            // shadow: 'outer'
        },
        "before_concat": [
            "src/**/*.js",
            "!src/tracker.js"
        ],
        "after_concat": []
    });
};