module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.config.set("uglify", {
        "options": {
            "mangle": false,
            "banner": "/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
        },
        "main": {
            "files": {
                "build/js/main.min.js": ["build/js/main.js"],
                "build/js/bower.min.js": ["build/js/bower.js"]
            }
        },
        "video": {
            "files": {
                "build/js/video.min.js": ["build/js/video.js"],
                "build/js/bower-video.min.js": ["build/js/bower-video.js"]
            }
        },
        "background": {
            "files": {
                "build/js/background.min.js": ["build/js/background.js"],
                "build/js/bower-background.min.js": ["build/js/bower-background.js"]
            }
        }
    });
};