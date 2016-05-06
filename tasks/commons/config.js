module.exports = function(grunt) {

    const fs = require('fs');

    grunt.loadNpmTasks("grunt-mustache-render");

    grunt.registerTask("config", "", function(build) {
        var dir = __dirname + "/../..",
            data = require(dir + "/config.json")[build];

        grunt.log.writeln("using " + build + " data");
        grunt.log.writeln(JSON.stringify(data));


        grunt.config.set("mustache_render", {
            "tracker": {
                files: [{
                    data: data,
                    template: dir + "/src/tracker.js.tmpl",
                    dest: dir + "/tmp/tracker.js"
                }]
            },
            "config": {
                files: [{
                    data: data,
                    template: dir + "/src/config.js.tmpl",
                    dest: dir + "/tmp/config.js"
                }]
            }
        });

        grunt.task.run("mustache_render");
    });
};