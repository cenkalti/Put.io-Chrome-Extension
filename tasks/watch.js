module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.config.set("watch", {
        "all": {
            "options": {
                "interrupt": true,
            },
            "files": [
                "src/**",
            ],
            "tasks": ["build_dev"]
        }
    });
};