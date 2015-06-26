module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-less");

    grunt.config.set("less", {
        "main": {
            "options": {
                "paths": "src/less"
            },
            "files": {
                "build/css/main.css": [
                    "src/app.less",
                    "src/modules/commons/*/*.less",
                    "src/modules/*/*.less",
                    "!src/modules/video/**"
                ],
            }
        },
        "video": {
            "options": {
                "paths": "src/less"
            },
            "files": {
                "build/css/video.css": "src/modules/video/**.less"
            }
        }
    });
};