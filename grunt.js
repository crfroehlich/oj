/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
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
		dest: 'app/index.html'
	},
    testHtml: {
		src: 'test/test.tmpl',
		dest: 'test/test.html',
		testJsFiles: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js']
	},
    concat: {
      dist: {
        src: '<config:lint.files>',
        dest: 'release/js/oj.<%= grunt.template.today("yyyy.m.d") %>.js'
      },
      html: {
        src: ['Index.html'],
        dest: 'Index.html'
      }
    },
    min: {
      dist: {
        src: ['app/oj.<%= grunt.template.today("yyyy.m.d") %>.js'],
        dest: 'app/oj.<%= grunt.template.today("yyyy.m.d") %>.min.js',
        separator: ';'
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
      }
    },
    docco: {
      files: '<config:lint.files>'
    },
    ducksboard: {
          tasks: {
              src: ['tasks/*.js'],
              endpoint: 'iMPZSvSciCQFntmd9MPlPvcYpEV4rBOu1tAv2TJWgEGDLBDCKh'
          }
      }

  });

	grunt.registerTask( 'indexHtml', 'Generate index.html depending on configuration', function() {
        var conf = grunt.config('indexHtml'),
            tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

	grunt.registerTask( 'testHtml', 'Generate test.html depending on configuration', function() {
        var conf = grunt.config('testHtml'),
            tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));

        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

	grunt.loadNpmTasks('grunt-barkeep');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-closure-compiler');

	// Default task.
	grunt.registerTask('default', 'qunit concat closure-compiler watch');

	//grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.registerTask('dev', 'indexHtml concat lint');
	grunt.registerTask('test', 'testHtml qunit');

};
