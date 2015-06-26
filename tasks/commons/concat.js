module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-concat");

    grunt.config.set("concat", {
        "options": {
            "banner": "/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
            "separator": "\n"
        },
        "main": {
            "files": {
                "build/js/main.js": [
                    "src/config.js",
                    "src/filters/*.js",
                    "src/factories/*.js",
                    "src/services/*.js",
                    "src/modules/commons/*/*.js",
                    "src/modules/*/*.js",
                    "!src/modules/video/**",
                    "src/app.js"
                ]
            }
        },
        "background": {
            "files": {
                "build/js/background.js": [
                    "src/config.js",
                    "src/filters/*.js",
                    "src/factories/*.js",
                    "src/services/*.js",
                    "src/modules/background/*.js"
                ]
            }
        },
        "video": {
            "files": {
                "build/js/video.js": [
                    "src/config.js",
                    "src/filters/*.js",
                    "src/factories/*.js",
                    "src/services/*.js",
                    "src/modules/video/*.js"
                ]
            }
        }
    });
};