module.exports = function(grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json")
    });
    grunt.task.loadTasks("tasks/commons");
    grunt.task.loadTasks("tasks");
}