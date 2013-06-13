
/*global module:false*/
module.exports = function (grunt) {
    var files = require('./files');
    var nsAppJsFiles = files.app;
    var nsAppCssFiles = ['app/css/*.css'];

    var nsTestJsFiles = ['test/*.js', 'test/*/*.js'];

    var nsVendorJsMinFiles = ['vendor/js/core/*.js', 'vendor/js/extensions/*.js'];
    var nsVendorJsFiles = nsVendorJsMinFiles;
    var nsVendorCssFiles = [];

    // Project configuration.
    grunt.initConfig({
        nsAppJsFiles: nsAppJsFiles,
        ojAppJsTestFiles: files.test,
        nsAppCssFiles: nsAppCssFiles,

        nsTestJsFiles: nsTestJsFiles,
        nsVendorJsFiles: nsVendorJsFiles,

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            //banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            //    '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n */\n'
            banner: '/*! <%= pkg.title %> - v <%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },

        buildMode: 'prod',
        buildPrefix: 'release/NS.' + grunt.template.today("yyyy.m.d") + '.min',

        clean: ['release'],

        concat: {
            prod: { //index.html
                src: ['app/index.tmpl'],
                dest: 'release/index.tmpl'
            },
            vendorCoreJs: {
                src: nsVendorJsMinFiles,
                dest: 'release/vendor.min.js',
                separator: ';/* next JS  */\n'
            },
            vendorCss: {
                src: nsVendorCssFiles,
                dest: 'release/vendor.min.css',
                separator: '/*  next CSS  */'
            },
            nsIntellisense: {
                src: nsAppJsFiles,
                dest: 'app/ojApp-vsdoc.js'
            }
        },

        cssmin: {
            options: {
                banner: '<%=meta.banner%>'
            },
            files: {
                src: nsAppCssFiles,
                dest: '<%= buildPrefix %>.css'
            }
        },

        docco: {
            src: nsAppJsFiles,
            options: {
                output: 'docs/'
            }

        },

        htmlminifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: false,
            removeRedundantAttributes: false,
            removeEmptyAttributes: false,
            removeOptionalTags: false
        },

        jsdoc: {

        },

        jshint: {
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                plusplus: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                strict: false,
                browser: true,
                globalstrict: false,
                smarttabs: true,
                reporter: 'jslint.js'
            },
            globals: {
                $: true,
                OJ: true,
                window: true,
                Ext: true
            },
            files: nsAppJsFiles
        },

        lint: {
            files: nsAppJsFiles
        },

        min: {

        },

        plato: {
            test: {
                options : {
                    complexity : {
                        logicalor : false,
                        switchcase : false,
                        forin : true,
                        trycatch : true
                    }
                },
                files: {
                    'test/plato': nsAppJsFiles,
                },
            }
        },

        qunit: {
            files: ['test/*.html']
        },

        tmpHtml: {
            prod: {
                src: 'release/index.tmpl',
                dest: 'index.html',
            },
            dev: {
                src: 'release/index.tmpl',
                dest: 'dev.html',
            },
            test: {
                src: 'test/test.tmpl',
                dest: 'test/Test.html',
                testJsFiles: nsTestJsFiles
            }
        },

        uglify: {
            options: {
                banner: '<%=meta.banner%>',
                ast: true,
                verbose: true,
                mangle: true,
                compress: true,
                //beautify: true,
                sourceMap: '<%= buildPrefix %>' + '.map'
            },
            files: {
                src: nsAppJsFiles,
                dest: '<%= buildPrefix %>' + '.js'
            }
        },

        watch: {
            files: nsAppJsFiles,
            tasks: ['buildDev', 'runUnitTests', 'buildProd']
        }

    });

    /**REGION: *-contrib tasks */

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-plato');

    /**ENDREGION: *-contrib tasks */

    /**REGION: init tasks */

    //grunt.loadNpmTasks('grunt-qunit-sonar');

    /**ENDREGION: init tasks */

    /**REGION: register ns tasks */

    grunt.registerTask('buildProd', function () {
        grunt.task.run('clean'); //Delete anything in the 'release' folder
        grunt.task.run('cssmin'); //Compile the CSS
        grunt.task.run('concat'); //Assembles the HTML template
        grunt.task.run('uglify'); //Compile the JavaScript
        grunt.task.run('toHtml:prod:prod'); //Generate the Main HTML file from the template
    });

    grunt.registerTask('buildDev', function () {
        grunt.task.run('toHtml:dev:test'); //Generate the HTML file from the template
        grunt.task.run('toHtml:dev:dev'); //Generate the HTML file from the template
        grunt.task.run('qunit'); //Unit tests
    });

    grunt.registerTask('toHtml', function (buildMode, page) {
        //This needs to be a Grunt task, because we want it to run serially. If executed as a function, its sequence in the execution will be unknown
        grunt.log.write('Starting template-to-HTML conversion for ' + buildMode + ' mode.');
        if (buildMode === 'dev' || buildMode === 'prod') {
            grunt.config('buildMode', buildMode);
        }
        var conf = grunt.config('tmpHtml')[page];
        var tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

    // Plain vanilla build task, which supports two modes: dev and prod. Dev always builds prod. Syntax is `grunt release:dev`
    grunt.registerTask('release', function(mode) {
        if (!mode) {
            throw grunt.task.taskError('Build mode must be supplied');
        }
        switch(mode) {
            case 'dev':
                grunt.task.run('buildProd');
                grunt.task.run('buildDev');
                break;
            case 'prod':
                grunt.task.run('buildProd');
                break;
        }
    });

    // Run any registered task
    grunt.registerTask('runArbitraryTask', function (taskName) {
        if (!taskName) {
            throw grunt.task.taskError('Task Name must be supplied');
        }
        grunt.task.run(taskName);
    });

    // Build the Test HTML and execute the QUnit tests
    grunt.registerTask('runUnitTests', function () {
        grunt.task.run('concat:vendorCoreJs');
        grunt.task.run('concat:vendorCss');
        grunt.task.run('toHtml:dev:test'); //Generate the HTML file from the template
        grunt.task.run('qunit');
        grunt.task.run('plato');
    });

    /**REGION: register ns tasks */
};
