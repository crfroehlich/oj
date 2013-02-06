/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    releasePath: 'release',
	pkg: '<json:package.json>',
	meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* No Copyright (!c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
      ducksboard_api_key: 'iMPZSvSciCQFntmd9MPlPvcYpEV4rBOu1tAv2TJWgEGDLBDCKh'
    },
	indexHtml: {
		src: 'app/index.tmpl',
		dest: '<%=releasePath%>' + '/index.html'
	},
    testHtml: {
		src: 'test/test.tmpl',
		dest: 'test/test.html',
		testJsFiles: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js']
	},
    concat: {
      dist: {
        src: '<config:lint.files>',
        dest: 'release/oj.min.js'
      },
      html: {
        src: ['Index.html'],
        dest: 'Index.html'
      },
      vendorJs: {
         src: ['vendor/js/*.js'],
         dest: 'vendor/vendor.js',
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
        oj: true,
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
    docco: {
      src: '<config:lint.files>',
	  dest: 'docs/'
	  
    }
  });

	grunt.registerTask( 'indexHtml', 'Generate index.html depending on configuration', function() {
        grunt.config('releasePath', 'app');
		var conf = grunt.config('indexHtml'),
            tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

	grunt.registerTask( 'testHtml', 'Generate test.html depending on configuration', function() {
        grunt.config('releasePath', 'test');
		var conf = grunt.config('testHtml'),
            tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-closure-compiler');

	// Default task.
	grunt.registerTask('default', 'concat closure-compiler qunit watch');

	//grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.registerTask('dev', 'indexHtml concat lint docco');
	grunt.registerTask('test', 'testHtml concat qunit docco');

};
