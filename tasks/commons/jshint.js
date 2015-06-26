module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.config.set("jshint", {
        "before_concat": [
            "src/**.js"
        ],
        "after_concat": [
            "build/js/main.js",
            "build/js/background.js",
            "build/js/video.js"
        ]
    });
};