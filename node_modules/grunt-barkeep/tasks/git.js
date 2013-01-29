module.exports = function( grunt ) {
    // ## git-recent-changes helper
    // Return an array of the files changed in the last commit. 
    grunt.registerHelper('git-recent-changes', function (callback) {
        grunt.utils.spawn({
            cmd: "git",
            args: [ "show", "--pretty=format:", "--name-only", "HEAD" ]
        }, function( err, result ) {
            if (err) {
                return callback(err, null);
            }

            var changed = {};
            changed = grunt.utils._.compact(result.split("\n"));
            return callback(null, changed);
        });
    });

    // ## git-recent-changes helper
    // Return an array of the files changed in the last commit. 
    grunt.registerHelper('git-modified-files', function (callback) {
        grunt.utils.spawn({
            cmd: "git",
            args: [ "ls-files", "--modified" ]
        }, function( err, result ) {
            if (err) {
                return callback(err, null);
            }
            var changed = {};
            changed = grunt.utils._.compact(result.split("\n"));
            return callback(null, changed);
        });
    });

    // # quick-concat
    // Remove concat targets (and any related min targets) for files that have
    // not been changed. To be run immediately after the snockets task.
    grunt.registerTask("quick-concat-and-min", function(option) {
        var done = this.async();
        var concat = grunt.config('concat');
        var min = grunt.config('min');
        
        this.requires(['snockets']);

        var helperName = option === 'modified' ? 'git-modified-files' : 'git-recent-changes';

        grunt.helper(helperName, function(err, files) {
            if (err) {
                git.log.error(err);
                return done(false);
            }
            grunt.utils._.each(concat, function(value, key) {
                if (files.indexOf(key) === -1 && grunt.utils._.intersection(files, concat[key].src).length === 0) {
                    grunt.verbose.writeln('removing concat target: ' + key);
                    delete concat[key];
                    grunt.verbose.writeln('removing min target: ' + key);
                    delete min[key];
                }
            });
            grunt.config.set('min', min);
            grunt.config.set('concat', concat);

            if (Object.keys(concat).length > 0) {
                grunt.task.run('concat min');
            }

            done();
        });
    });

};