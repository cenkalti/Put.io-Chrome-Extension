module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.config.set("jshint", {
        options: {
            maxerr: 10,
            maxdepth: 2,
            maxparams: 10,
            unused: true,
            undef: true,
            node: true,
            shadow: 'outer',
            globals: {
                angular: true,
                window: true,
                woopra: true,
                wp: true,
                async: true,
                _: true,
                $: true,
                moment: true,
                chrome: true,
            },
            reporter: require('jshint-stylish').toString()
        },
        "before_concat": [
            "src/**/*.js.tmpl",
            "src/**/*.js"
        ],
        "after_concat": [
            "build/js/background.js",
            "build/js/main.js",
            "build/js/video.js",
        ]
    });
};