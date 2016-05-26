module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.config.set('jshint', {
        options: {
            maxerr: 10,
            maxdepth: 3,
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
                document: true,
                ptn: true,
                videojs: true,
                location: true
            },
            reporter: require('jshint-stylish').toString()
        },
        before_concat: [
            'src/**/*.js.tmpl',
            'src/**/*.js'
        ],
        after_concat: [
            'build/js/background.js',
            'build/js/index.js',
            'build/js/video.js',
        ]
    });
};