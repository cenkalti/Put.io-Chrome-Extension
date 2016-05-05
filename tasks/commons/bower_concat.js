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
                "angular-tree-control": "angular",
                "angular-sanitize": "angular",
                "angular-cookies": "angular",
                "ng-joyride": ["angular", "jquery", "bootstrap"]
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
                "video.js",
                "ng-joyride"
            ],
            "dependencies": {
                "angular": "jquery",
                "ng-underscore": "angular",
                "angular-cookies": "angular",
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
                "angular-tree-control",
                "ng-joyride"
            ],
            "dependencies": {
                "angular": "jquery",
                "angular-cookies": "angular",
                "angular-route": "angular"
            },
            "bowerOptions": {
                "relative": false
            }
        }
    });
};