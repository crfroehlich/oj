/*global module:false*/
module.exports = function(grunt) {
	var jsFiles = [
		'app/js/oj.js', 'app/js/**/*.js', 'app/init.js'
	];
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    jsFiles: jsFiles,
	meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* No Copyright (!c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
      ducksboard_api_key: 'iMPZSvSciCQFntmd9MPlPvcYpEV4rBOu1tAv2TJWgEGDLBDCKh'
    },
	index: {
		src: 'app/index.tmpl',  // source template file
		dest: 'app/index.html'  // destination file (usually index.html)
	  },
    concat: {
      dist: {
        src: jsFiles,
        dest: 'app/oj.<%= grunt.template.today("yyyy.m.d") %>.js'
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
      files: ['test/**/*.html']
    },
    lint: {
      files: jsFiles
    },
    watch: {
      files: jsFiles,
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
        globalstrict: false
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
      files: ['app/ol.js', 'app/**/*.js']
    },
    ducksboard: {
          tasks: {
              src: ['tasks/*.js'],
              endpoint: 'iMPZSvSciCQFntmd9MPlPvcYpEV4rBOu1tAv2TJWgEGDLBDCKh'
          }
      }
    
  });
 
  grunt.registerTask( 'index', 'Generate index.html depending on configuration', function() {
        var conf = grunt.config('index'),
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
  grunt.registerTask('dev', 'index lint watch qunit');
  
  grunt.registerTask('dev', 'index concat watch qunit');
}; 
