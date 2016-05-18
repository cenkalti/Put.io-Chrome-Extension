module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-json-replace');

    grunt.config.set('json-replace', {
        options: {
            space: '    '
        },
        version: {
            options: {
                replace: {
                    version: '<%= pkg.version %>'
                }
            },
            files: [{
                src: 'package.json',
                dest: 'package.json'
            }, {
                src: 'bower.json',
                dest: 'bower.json'
            }, {
                src: 'src/manifest.json',
                dest: 'src/manifest.json'
            }]
        },
        packages: {
            options: {
                replace: {}
            },
            files: [{
                src: 'package.json',
                dest: 'package.json'
            }, {
                src: 'bower.json',
                dest: 'bower.json'
            }, {
                src: 'src/manifest.json',
                dest: 'src/manifest.json'
            }]
        }
    });
};