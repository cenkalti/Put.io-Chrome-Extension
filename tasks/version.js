module.exports = function(grunt) {
    grunt.registerTask("version", "Update version for all .json files", function(version) {
        if (version) {
            grunt.config.set("pkg.version", version);
            grunt.task.run("json-replace:version");
        } else {
            grunt.fail.warn("version is missing (grunt version:VERSION)");
        }
    });
};