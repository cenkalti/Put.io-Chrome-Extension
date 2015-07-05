module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.config.set("jshint", {
        "before_concat": [
            "src/**.js",
            "!src/tracker.js"
        ],
        "after_concat": [
        ]
    });
};