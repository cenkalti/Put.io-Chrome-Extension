module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.config.set("copy", {
        "fonts": {
            "files": [{
                "expand": true,
                "flatten": true,
                "src": [
                    "bower_components/bootstrap/dist/fonts/*",
                    "bower_components/video.js/dist/font/*"
                ],
                "dest": "build/fonts/"
            }]
        },
        "images": {
            "files": [{
                "expand": true,
                "flatten": true,
                "src": [
                    "src/img/*",
                    "bower_components/angular-tree-control/images/*"
                ],
                "dest": "build/img/"
            }]
        },
        "directives": {
            "files": [{
                "expand": true,
                "flatten": true,
                "src": [
                    "src/modules/commons/*/directives/*.html",
                    "src/modules/*/directives/*.html"
                ],
                "dest": "build/html/"
            }]
        },
        "main": {
            "files": [{
                "expand": true,
                "flatten": true,
                "src": [
                    "src/index.html",
                    "src/modules/background/background.html",
                    "src/modules/video/video.html",
                    "src/manifest.json"
                ],
                "dest": "build/"
            }]
        },
        "dev": {
            "files": [{
                "src": "build/js/main.js",
                "dest": "build/js/main.min.js"
            }, {
                "src": "build/js/bower.js",
                "dest": "build/js/bower.min.js"
            }, {
                "src": "build/js/video.js",
                "dest": "build/js/video.min.js"
            }, {
                "src": "build/js/bower-video.js",
                "dest": "build/js/bower-video.min.js"
            }, {
                "src": "build/js/background.js",
                "dest": "build/js/background.min.js"
            }, {
                "src": "build/js/bower-background.js",
                "dest": "build/js/bower-background.min.js"
            }]
        }
    });
};