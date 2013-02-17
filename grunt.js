/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        releasePath: 'release',
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' + '* No Copyright (!c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>'
        },
        tmpHtml: {
            release: {
                src: 'app/index.tmpl',
                dest: '<%=releasePath%>' + '/index.html'
            },
            test: {
                src: 'test/test.tmpl',
                dest: 'test/test.html',
                testJsFiles: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js']
            },
            debug: {
                src: 'app/index.tmpl',
                dest: 'app/index.html'
            }
        },
        concat: {
            dist: {
                src: '<config:lint.files>',
                dest: 'release/oj.min.js'
            },
// No HTML to concat for now
//            html: {
//                src: '<%=releasePath%>/index.html',
//                dest: 'index.html'
//            },
            vendorCoreJs: {
                src: ['vendor/js/core/*.js'],
                dest: 'vendor/vendor-core.js',
                separator: ';\n\n\n;'
            },
            vendorAddJs: {
                src: ['vendor/js/extensions/*.js'],
                dest: 'vendor/vendor-extensions.js',
                separator: ';\n\n\n;'
            },
            vendorCss: {
                src: ['vendor/js/*.css'],
                dest: 'vendor/vendor.css'
            }
        },
        min: {
            dist: {
                src: ['app/oj.<%= grunt.template.today("yyyy.m.d") %>.js'],
                dest: 'app/oj.<%= grunt.template.today("yyyy.m.d") %>.min.js',
                separator: ';\n\n\n;'
            }
        },
        qunit: {
            files: ['test/*.html']
        },
        lint: {
            files: ['app/*.js', 'app/**/*.js', 'app/**/**/*.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'concat min closure-compiler'
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
                smarttabs: true
            },
            globals: {
                $: true,
                OJ: true,
                window: true,
                Ext: true
            }
        },
        uglify: {
            ast: true,
            verbose: true
        },
        'closure-compiler': {
            frontend: {
                js: '<config:concat.dist.dest>',
                jsOutputFile: 'new.min.js',
                options: {
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            },
            includeSourcemap: {
                js: '<config:lint.files>',
                jsOutputFile: "release/oj.min.js",
                options: {
                    create_source_map: "release/oj.min.js.map",
                    source_map_format: "V3"
                }
            }
        },
        'append-sourcemapping': {
            main: {
                files: {
                    "release/oj.min.js": "oj.min.js.map"
                }
            }
        },
        jsdoc: {
            dist : {
                src: '<config:lint.files>',
                dest: 'docs'
            }
        },
        'qunit-sonar': {
             mysubtask: {
                "minimum": 0.01, //min coverage; 80% default
                "srcDir":'<config:lint.files>', //your source here
                "depDirs": ["vendor/vendor-core.js", "vendor/vendor-extensions.js"], //your depended files
                "outDir": "coverage", //where you want save reports (LCov and xml)
                "testFiles": "coverage/TestsChart.html" // html file where you include unit tests
            }
        }
    });

    /**REGION: init tasks */

    grunt.loadNpmTasks('grunt-growl');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-jsdoc-plugin');

    grunt.loadNpmTasks('grunt-qunit-sonar');

    /**ENDREGION: init tasks */

    /**REGION: register tasks */

    var buildHtmlFromTmpl = function(releasePath, path) {
        grunt.log.write('Starting HTML concat for ' + releasePath + ' mode.')
        grunt.config('releasePath', releasePath);
        var conf = grunt.config(path);
        var tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    };

    grunt.registerTask('releaseTmpl', 'Generate Release/index.html from app.tmpl template.', function() {
        buildHtmlFromTmpl('release', 'tmpHtml.release');
    });

    grunt.registerTask('debugTmpl', 'Generate App/index.html from app.tmpl template.', function() {
        buildHtmlFromTmpl('debug', 'tmpHtml.debug');
    });

    grunt.registerTask('testTmpl', 'Generate Test/test.html from test.tmpl template.', function() {
        buildHtmlFromTmpl('test', 'tmpHtml.test');
    });

    grunt.registerTask('default', 'debugTmpl concat closure-compiler qunit watch');

    grunt.registerTask('dev', 'debugTmpl concat lint');
    grunt.registerTask('test', 'testTmpl lint concat qunit');


    grunt.registerTask('sonar', 'qunit-sonar');
    /**REGION: register tasks */
};
