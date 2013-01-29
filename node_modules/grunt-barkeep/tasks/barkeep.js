/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // Tasks
  // ====
  grunt.registerTask('barkeep', 'This task is useless.', function() {
    grunt.log.write(grunt.helper('barkeep'));
  });

  // Helpers
  // ====
  grunt.registerHelper('barkeep', function() {
    return 'barkeep!!!';
  });

};