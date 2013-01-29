module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    meta: {
      ducksboard_api_key: 'foo.bar'
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    docco: {
      files: ['tasks/*.js']
    },
    snockets: {
      test: {
          src: ['test/fixtures/b.js'],
          options: {
              concat: {
                 destExtension: "debug.js",
                 destDir: "target"
              },
              min: {
                 destExtension: "min.js"
              }
          }
      },
      coffee: {
        src: ['test/fixtures/first.coffee'],
        options: {
            concat: {
              destExtension: "debug.coffee",
              destDir: 'target'
            }
        }
      }
    },
    clean: {
        all: {
            src: ['node_modules/glob']
        }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    deploy: {
        aws_key: 'key',
        aws_secret: 'secret',
        aws_bucket: 'bucket',
        bucketDir: 'scripts',
        srcDir: 'tasks',
        src: ['tasks/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    ducksboard: {
        tasks: {
            src: ['tasks/*.js'],
            endpoint: 'foo.bar'
        }
    }
  });
  
  // Load S3
  grunt.loadNpmTasks('grunt-s3');
  
  // Load local tasks.
  grunt.loadTasks('tasks');
  
  // Simple task for testing helpers.
  grunt.registerTask('test-helpers', 'Test helpers.', function () {
      var done = this.async();
      grunt.helper('commandExists', 'foo', function(exists) {
        console.log('foo exists?', exists);
        done();
      });
      /*grunt.helper('deleteDirectory', 'docs', function(err) {
          if (err) {
             grunt.warn(err);
          }
          done();
      });*/ 
  });
  
  // Default task.
  grunt.registerTask('default', 'lint');
};
