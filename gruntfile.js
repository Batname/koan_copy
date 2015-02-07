'use strict';

var fs = require('fs');

var paths = {
    jade: ['src/jade/**/*.jade'],
    coffee: ['src/coffee/**/*.coffee'],
    sass: ['src/scss/**/*.scss']
};

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        watch: {
            client: {
                files: ['public/**', '!public/bower_components/**'],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['.nodemon'],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: paths.jade,
                tasks: 'jade'
            },
            coffee: {
                files: paths.coffee,
                tasks: 'coffee'
            },
            sass: {
                files: paths.sass,
                tasks: 'sass'
            }
        },
        jade: {
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/jade",
                    src: ["**/*.jade"],
                    dest: "public",
                    ext: ".html"
                }],
                options: {
                    livereload: true
                }
            }
        },
        sass : {
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/scss",
                    src: ["**/*.scss"],
                    dest: "public/stylesheets",
                    ext: ".css"
                }]
            }
        },
        coffee : {
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/coffee",
                    src: ["**/*.coffee"],
                    dest: "public/javascripts",
                    ext: ".js"
                }],
                options: {
                    livereload: true
                }
            }            
        },
        nodemon: {
            dev: {
                script: './app/app.js',
                options: {
                    nodeArgs: ['--debug', '--harmony'],
                    ignore: ['node_modules/**', 'public/**'],
                    callback: function (nodemon) {
                        fs.writeFileSync('.nodemon', 'started');
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                        nodemon.on('restart', function () {
                            setTimeout(function () {
                                fs.writeFileSync('.nodemon', 'restarted');
                            }, 250);
                        });
                    }
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch', 'sass', 'coffee', 'jade'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            server: {
                options: {
                    reporter: 'dot',
                    require: ['should', 'co-mocha']
                },
                src: ['test/server/**/*.js']
            }
        },
        karma: {
            unit: {
                configFile: 'test/client/karma.conf.js'
            }
        },
        protractor: {
            e2e: {
                configFile: "test/client/protractor.conf.js",
                keepAlive: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('default', ['concurrent']);

    grunt.registerTask('test', ['env:test', 'mochaTest:server', 'karma:unit']);
};