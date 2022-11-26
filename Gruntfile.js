module.exports = function( grunt ) {
    'use strict';

    const fs = require( 'fs' ),
        pkgInfo = grunt.file.readJSON( 'package.json' );


    // Project configuration
    grunt.initConfig( {
        pkg: pkgInfo,
        copy: require( './.grunt-config/copy' ),
        clean: {
            main: ['build/']
        },
        run: {
            options: {},
            build: {
                cmd: 'yarn',
                args: ['run', 'build']
            },
            removeDev: {
                cmd: 'composer',
                args: ['install', '--no-dev', '--ignore-platform-reqs', '--optimize-autoloader']
            },
            dumpautoload: {
                cmd: 'composer',
                args: ['dumpautoload', '-o']
            }
        }
    } );

    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask( 'build', [
        'run:build',
        'run:removeDev',
        'run:dumpautoload'
    ]);

    grunt.registerTask('publish', [
        'clean',
        'copy',
    ]);

    // grunt.registerTask( 'publish', ( releaseType ) => {
    //     releaseType = releaseType ? releaseType : 'patch';
    //
    //     var prevStableVersion = 'patch' === releaseType ? pkgInfo.prev_stable_version : pkgInfo.version;
    //
    //     grunt.config.set( 'prev_stable_version', prevStableVersion );
    //
    //     grunt.task.run( 'default' );
    //     grunt.task.run( 'bumpup:' + releaseType );
    //     grunt.task.run( 'replace' );
    //     grunt.task.run( 'shell:git_add_all' );
    //     grunt.task.run( 'release' );
    // } );
};