module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-bower-concat");

    grunt.config.set("bower_concat", {
        "main": {
            "dest": "build/js/bower.js",
            "exclude": [
                "video.js"
            ],
            "dependencies": {
                "angular": "jquery",
                "angular-route": "angular",
                "ng-underscore": "angular",
                "angular-loading-bar": "angular",
                "bootstrap": "jquery",
                "angular-xeditable": "angular",
                "angular-tree-control": "angular"
            },
            "bowerOptions": {
                "relative": false
            }
        },
        "background": {
            "dest": "build/js/bower-background.js",
            "exclude": [
                "bootstrap",
                "angular-loading-bar",
                "angular-xeditable",
                "angular-tree-control",
                "video.js"
            ],
            "dependencies": {
                "angular": "jquery",
                "ng-underscore": "angular"
            },
            "bowerOptions": {
                "relative": false
            }
        },
        "video": {
            "dest": "build/js/bower-video.js",
            "exclude": [
                "bootstrap",
                "angular-loading-bar",
                "angular-xeditable",
                "angular-tree-control"
            ],
            "dependencies": {
                "angular": "jquery",
                "angular-route": "angular"
            },
            "bowerOptions": {
                "relative": false
            }
        }
    });
};