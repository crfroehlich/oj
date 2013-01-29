/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
var util = require('util'),
    path = require('path'),
    fs = require('fs');
    
module.exports = function(grunt) {    
    // ## docco task
    // Generates docco reports for an array of javascript files.
    grunt.registerMultiTask('docco', 'Generate docco javascript documentation.', function () {
        var done = this.async();
        var js = grunt.file.expandFiles(this.file.src);

        if (js.length === 0) {
            grunt.warn('No files found to generate docs.');
        }

        // Find the path to docco, wherever that may be.
        try {
            var doccoPath = path.resolve(require.resolve('docco'), '../../bin');
        } catch (e) {
            grunt.fatal('grunt couldn\'t find the npm docco module.\n Did you install it (npm install -g docco)?');
        }
        // Spawn the docco process.
        var spawn = grunt.utils.spawn({cmd: path.join(doccoPath, 'docco'), args: js}, function (err, result, code) {
            if (err) {
                grunt.warn('Could not generate docs. ' + 
                    ' Please verify docco and Pygments are installed.' +
                    ' To install Pygments run \'easy_install Pygments\'', code);
                return done(code);
            }
            grunt.log.writeln(result);
            done();    
        });
    }); 
};