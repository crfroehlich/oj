
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
        nsAppJsTestFiles: files.test,
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

        //purges the contents of the release folder
        clean: ['release', 'temp', 'docs'],

        //This will concatenate the template files together and prepare them for the parser
        concat: {
            prod: { //index.html
                src: ['templates/header.tmpl', 'templates/scripts.tmpl', 'templates/end.tmpl'],
                dest: 'temp/index.tmpl'
            },
            dev: { //index.html
                src: ['templates/header.tmpl', 'templates/scripts.tmpl', 'templates/end.tmpl'],
                dest: 'temp/index.tmpl'
            },
            sql: { //sql.html
                src: ['templates/header.tmpl', 'templates/scripts.tmpl', 'templates/end.tmpl'],
                dest: 'temp/sql.tmpl'
            },
            test: { //test.html
                src: ['templates/header.tmpl', 'templates/scripts.tmpl', 'templates/test.tmpl', 'templates/end.tmpl'],
                dest: 'temp/test.tmpl'
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
                dest: 'release/nsApp-vsdoc.js'
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
		
		githubPages: {
			target: {
				options: {
					// The default commit message for the gh-pages branch
					commitMessage: 'pushing api docs'
				},
				// The folder where your gh-pages repo is
				src: '_apidocs'
			}
		},

        jsdoc: {
            src: ['README.md', 'app/**/*.js'],
            options: {
                configure: '.jsdocrc',
				destination: '_apidocs'
            }
        },

        //Brutal honesty
        jshint: {
            options: {
                globals: {
                    $: true,
                    $nameSpace$: true,
                    window: true,
                    Ext: true
                },
                force: true, //Show errors, but don't fail the task.
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
                reporterOutput: 'jslint.log'
            },
            files: nsAppJsFiles
        },

        //Cyclomatic complexity reporting
        plato: {
            test: {
                options: {
                    complexity: {
                        logicalor: false,
                        switchcase: false,
                        forin: true,
                        trycatch: true
                    }
                },
                files: {
                    'plato': nsAppJsFiles,
                },
            }
        },

        qunit: {
            files: ['test/*.html']
        },

        tmpHtml: {
            prod: {
                src: 'temp/index.tmpl',
                dest: 'release/index.html',
                jsFiles: ['<%= buildPrefix %>.js'],
                cssFiles: ['<%= buildPrefix %>.css'],
                title: 'Production Index Page'
            },
            dev: {
                src: 'temp/index.tmpl',
                dest: 'app/dev.html',
                jsFiles: nsAppJsFiles,
                cssFiles: nsAppCssFiles,
                title: 'Development Index Page'
            },
            sql: {
                src: 'temp/sql.tmpl',
                dest: 'app/sql.html',
                jsFiles: nsAppJsFiles,
                cssFiles: nsAppCssFiles,
                title: 'SQL Builder'
            },
            test: {
                src: 'temp/test.tmpl',
                dest: 'test/Test.html',
                jsFiles: nsTestJsFiles,
                cssFiles: ['vendor/test/qunit-1.11.0.css'],
                title: 'Unit Tests'
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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-docco2');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-github-pages');
	
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
        grunt.task.run('toHtml:prod'); //Generate the Main HTML file from the template
    });

    grunt.registerTask('buildDev', function (exhaustive) {
        grunt.task.run('toHtml:test'); //Generate the Unit Test HTML file from the template
        grunt.task.run('toHtml:dev'); //Generate the plain Dev HTML file from the template
        grunt.task.run('toHtml:sql'); //Generate the SQL Builder HTML file from the template

        if (exhaustive) {
            grunt.task.run('jshint');
            grunt.task.run('jsdoc');
            grunt.task.run('plato');
            grunt.task.run('qunit'); //Unit tests
        }
    });

    grunt.registerTask('buildDocs', function () {
		grunt.task.run('jsdoc');
		grunt.task.run('githubPages');
	});

    grunt.registerTask('toHtml', function (page) {
        //This needs to be a Grunt task, because we want it to run serially. If executed as a function, its sequence in the execution will be unknown
        grunt.log.write('Starting template-to-HTML conversion for ' + page + ' mode.');
        
        if (page) {
            grunt.config('buildMode', page);
        }
        var conf = grunt.config('tmpHtml')[page];
        var tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

    // Plain vanilla build task, which supports two modes: dev and prod. Dev always builds prod. Syntax is `grunt release:dev`
    grunt.registerTask('release', function (mode, exhaustive) {
        if (!mode) {
            throw grunt.task.taskError('Build mode must be supplied');
        }
        switch (mode) {
            case 'dev':
                grunt.task.run('buildProd');
                grunt.task.run('buildDev:' + exhaustive);
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
        grunt.task.run('jsdoc');
        grunt.task.run('plato');
        grunt.task.run('qunit');
    });

    grunt.registerTask('default', ['release:dev:true']);

    /**REGION: register ns tasks */
};
