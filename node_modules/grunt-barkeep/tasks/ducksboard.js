/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
module.exports = function(grunt) {    
    var peking = require('peking');
    var fs = require('fs');
    var gzip = require('gzip-js');
    
    // ## helper filesize
    // Get the combined filesize (including gzipped) of a collection of files.
    grunt.registerHelper('filesize', function (files, cb) {
        // Keep track of the total numbe of bytes.
        var totalSize = 0;
        // Store all of the text we read from each file.
        var totalData;
        grunt.utils.async.forEach(files, function(file, callback) {
            grunt.utils.async.parallel([
                function(cb2) {
                    fs.stat(file, function(err, stat) {
                        if (err) {
                            cb2(err);
                        } 
                        totalSize += stat.size;
                        cb2();                               
                    });                    
                },
                function(cb2) {
                    fs.readFile(file, function(err, data) {
                        if (err) {
                            cb2(err);
                        }
                        totalData += data;
                        cb2();
                    });
                }
                ], function(err, results) {
                    if (err) {
                        callback(err);
                    } 
                    callback();                               
                });
        }, function(err) {
            if (err) {
                cb(err, null);
            }
            
            // Get compressed size of all of the files.
            var compressed = gzip.zip(totalData, {level: 6});
            
            cb(null, totalSize, compressed.length);
        });
    });
    
    // # multitask ducksboard
    // Send file size data of a collection of files to ducksboard
    grunt.registerMultiTask('ducksboard', 'Send file size data to ducksboard.', function() {
        var done = this.async(), task = this;
        this.requiresConfig('meta.ducksboard_api_key');
        var endpoint = this.data.endpoint;  
        var gzip = this.data.gzip === true;
        if (!endpoint) {
            grunt.warn('Every target must specify an endpoint.');
        }
        
        var js = grunt.file.expandFiles(this.file.src);        
        grunt.helper('filesize', js, function(err, totalSize, compressedSize) {
            if (err) {
                grunt.warn(err);
            }
            grunt.log.writeln('[' + task.target + '] total size (bytes): ' + totalSize + 
                ' compressed (bytes): ' + compressedSize);
            peking.pushValue({value: gzip ? compressedSize : totalSize, 
                endpoint: endpoint, api_key: grunt.config('meta.ducksboard_api_key')}, function (err) {
                if (err) {
                    grunt.warn('Could not send data to ducksboard. Code ' + err + '.');
                }
                done();    
            });
        });
    });
};