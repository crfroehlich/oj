/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf');
    
module.exports = function(grunt) {    
    // ## directory helper
    // Creates a directory if one doesn't already exist, with optional callback.
    grunt.registerHelper('directory', function (dir, callback) {
        if (!dir) {
            throw 'You must specify a directory name.';
        }
        
        if (!path.existsSync(dir)){
            fs.mkdirSync(dir);
            if (callback){
                callback(dir);
            }
        }    
        return this;
    });
    
    // # deleteDirectory helper
    // Deletes a directory using rimraf.
    grunt.registerHelper('deleteDirectory', function(directory, cb) {
        rimraf(directory, function(err) {
            if (err) {
                return cb(err);
            }
            cb();
        });
    });
    
    // # commandExists helper
    // Determine if a command on the system exists (POSIX only)
    grunt.registerHelper('commandExists', function(command, cb) {
        var spawn = grunt.utils.spawn({cmd: 'command', args: ['-v', command]}, function (err, result, code) {
            if (code > 0) {
                cb(false);
            }
            cb(true);
        });
    });
        
    // ## multitask clean
    // Deletes specific files or directories.
    grunt.registerMultiTask('clean', 'delete specific files or directories', function () {
        var done = this.async();
        var files = grunt.file.expandFiles(this.file.src).map(function(f) {
            return {type: 'file', name: f};
        });
        var dirs = grunt.file.expandDirs(this.file.src).map(function(f) {
            return {type: 'dir', name: f};
        });
        
        grunt.utils.async.forEach(files.concat(dirs), function(file, cb) {
           grunt.verbose.writeln('Deleting: ' + file.name);
           if (file.type === 'file') {
               fs.unlink(file.name, function(err) {
                   if (err) {
                       cb(err);
                   }
                   cb();
               });
           } else if (file.type === 'dir') {
               grunt.helper('deleteDirectory', file.name, function(err) {
                   if (err) {
                       cb(err);
                   }
                   cb();                  
               });
           }
        }, function (err) {
            if (err) {
                grunt.warn('Could not delete files: ' + err);
            }
            grunt.verbose.writeln('Deleted all...');
            done();
        });
    });
};
