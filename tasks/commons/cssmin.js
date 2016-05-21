module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.config.set('cssmin', {
        main: {
            options: {
                banner: '/* <%= pkg.short_name %> - <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            files: {
                'build/css/index.min.css': 'build/css/index.css'
            }
        },
        video: {
            files: {
                'build/css/video.min.css': [
                    'bower_components/angular/angular-csp.css',
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/video.js/dist/video-js.css',
                    'build/css/video.css'

                ]
            }
        },
        bower: {
            files: {
                'build/css/bower.min.css': [
                    'bower_components/angular/angular-csp.css',
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/angular-xeditable/dist/css/xeditable.css',
                    'bower_components/angular-loading-bar/src/loading-bar.css',
                    'bower_components/angular-tree-control/css/tree-control.css',
                    'bower_components/angular-tree-control/css/tree-control-attribute.css',
                    'bower_components/ng-joyride/ng-joyride.css',
                    'bower_components/angular-bootstrap/ui-bootstrap-csp.css'
                ]
            }
        }
    });
};