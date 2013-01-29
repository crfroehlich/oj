/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
module.exports = function(grunt) {   
    var zlib = require('zlib');
    var crypto = require('crypto');
    var mime = require('mime');
    var fs = require('fs');
    var path = require('path');
    
    // # helper gzip-md5
    // gets md5 of a file, after gzipping.
    grunt.registerHelper('gzip-md5', function(src, cb) {
        var tmp = src + '.gz';
        var incr = 0;
        while (path.existsSync(tmp)) {
          tmp = src + '.' + (incr++) + '.gz';
        }

        var input = fs.createReadStream(src);
        var output = fs.createWriteStream(tmp);
        // Gzip the file and get the MD5.
        input.pipe(zlib.createGzip()).pipe(output).on('error', function (err) {
            return cb(err, null);
          }).on('close', function () {
              fs.readFile(tmp, null, function (err, data) {
                  if (err) {
                      return cb(err, null);
                  }
                  return cb(null, crypto.createHash('md5').update(data).digest("hex"));
              });
          });
    });
    
    // ## connectToS3
    // Establishes a connection to the Amazon S3 bucket.
    var connectToS3 = function (options) {
        options = options || {};  
        var accessKeyId = options.accessKeyId || process.env.AWS_ACCESS_KEY_ID, 
            secretAccessKey = options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
            awssum = require('awssum'),
            amazon = awssum.load('amazon/amazon'),
            S3Service = awssum.load('amazon/s3');

        if (!accessKeyId || !secretAccessKey) {
            throw "Error: Must specify the env variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY";
        }
        return new S3Service(accessKeyId, secretAccessKey, "ops", amazon.US_EAST_1);    
    };

    // ## createClient
    // Creates an S3 client.
    var createClient = function (options) {
        var s3 = {};
        s3.client = connectToS3(options);
        s3.bucket = options.bucket || '';
        return s3;
    };
    
    // ## getBucketObjects
    // Gets a listing of objects in an S3 bucket, with an optional prefix. 
    var getBucketObjects = function (prefix, s3, callback) {
        if (!s3.client || !s3.bucket) {
            grunt.warn("Error: No client or bucket name defined.");
        }
        // List all of the objects in the bucket starting with prefix.
        var options = {BucketName : s3.bucket, Prefix: prefix || ''};
        s3.client.ListObjects(options, function(err, data) {
            if (err) {
                var message = (err.Body && err.Body.Error && err.Body.Error.Message) || 'Unknown';
                return callback({message: "Could not fetch bucket objects. " + message});
            }
            var bucketContents = data.Body.ListBucketResult.Contents;

            callback(null, bucketContents);
        });    
    };
    
    // # task prepare-deploy
    // Determines to files to upload or delete to S3. Run before the grunt-s3 npm package (bundled separately).
    grunt.registerTask('prepare-deploy', 'Determine files to upload or delete from S3.', function() {
       var exec = require('child_process').exec;
       var done = this.async();
   
       this.requiresConfig('deploy.aws_key', 'deploy.aws_secret', 'deploy.aws_bucket', 'deploy.bucketDir', 'deploy.src', 'deploy.srcDir');

       var key = grunt.config('deploy.aws_key'); //process.env.AWS_ACCESS_KEY_ID;
       var secret = grunt.config('deploy.aws_secret'); //process.env.AWS_SECRET_ACCESS_KEY;
       var bucket = grunt.config('deploy.aws_bucket'); //process.env.AWS_S3_BUCKET;
       var s3Config = {};       
   
       var s3Client = createClient({accessKeyId: key,
               secretAccessKey: secret, 
               bucket: bucket});
       grunt.verbose.writeln('fetching amazon bucket metadata from: ' + grunt.config('deploy.bucketDir'));
       
       getBucketObjects(grunt.config('deploy.bucketDir'), s3Client, function (err, remotes) {
           if (err) {
               grunt.fatal(err);
           }
           if (!grunt.utils._.isArray(remotes)) {
               remotes = [];
           }
           grunt.verbose.writeln('fetched metadata for ' + remotes.length + ' objects.');
           var locals = grunt.file.expandFiles(grunt.config('deploy.src'));
           var localFiles = locals.map(function(f) {
               return f.replace(grunt.config('deploy.srcDir'), '');
           });
           var remoteFiles = remotes.map(function(f) {
               if (grunt.utils._.isArray(f.Key)) {
                  return f.Key[0].replace(grunt.config('deploy.bucketDir'), '');
               } else if (grunt.utils._.isString(f.Key)) {
                  return f.Key.replace(grunt.config('deploy.bucketDir'), '');
               } else {
                  return '';
               }
           });

           var add = grunt.utils._.difference(localFiles, remoteFiles);
           var del = grunt.utils._.difference(remoteFiles, localFiles);
           var update = grunt.utils._.intersection(remoteFiles, localFiles);
           
           // Determine which files have really changed by comparing md4 hashes.
           grunt.utils.async.filter(update, function(file, callback) {
               var localFile = path.join(process.pwd, grunt.config('deploy.srcDir'), file);

               fs.readFile(localFile, null, function (err, data) {
                   if (err) {
                       return done(err);
                   }
                   grunt.helper('gzip-md5', localFile, function (err, localHash) {
                       if (err) {
                           done(err);
                       }
                       // The file is unchanged if there are any buckets with
                       // the same key and MD5 hash.
                       var unchangedFile = grunt.utils._.any(remotes, function (bucket) {
                           var bucketTag = grunt.utils._.isArray(bucket.ETag) ? bucket.ETag[0] : bucket.ETag;
                           var bucketKey = grunt.utils._.isArray(bucket.Key) ? bucket.Key[0] : bucket.Key;
                           var eTag = bucketTag.replace(/"/g, '');
                           var key = bucketKey.replace(grunt.config('deploy.bucketDir'), '');
                           var mimeBucket = mime.lookup(key), localMime = mime.lookup(localFile);
                           return key === file && eTag === localHash && mimeBucket === localMime;
                       });
                       return callback(unchangedFile === false);
                   });          
               });    
           }, function (updateFiles) {
               // If there are no modifications, we're done.
               if (add.length === 0 && update.length === 0 && del.length === 0) {
                   console.log('  Local files in sync with S3. Nothing to deploy.');
               }
           
               // Create grunt s3 configuration object.
               s3Config.key = key;
               s3Config.secret = secret;
               s3Config.bucket = bucket;
               s3Config.upload = updateFiles.concat(add).map(function(uf) {
                   return {src: path.join(grunt.config('deploy.srcDir'), uf),
                         dest: path.join(grunt.config('deploy.bucketDir'), uf),
                         gzip: true};
               });
               s3Config.del = del.map(function(uf) {
                   return {src: path.join(grunt.config('deploy.bucketDir'), uf)};
               });
               s3Config.copy = [];
               grunt.verbose.writeln(require('util').inspect(s3Config));
               grunt.config.set('s3', s3Config);               
               return done();            
           });          
       });      
     });
 };
