var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    plugins = require("gulp-load-plugins")(),
    path = require('path'),
    gulpBowerFiles = require('gulp-bower-files'),
    wiredep = require('wiredep'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    server = lr();

var extended = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

var succint = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %> licensed. <%= pkg.homepage %>\n';

var paths = {
    css: './src/css',
    js: './src/coffee',
    release: './dist',
    lib: './bower_components',
    less: './src/less',
    coffee: './src/coffee',
    src: './src'
};

var files = {
    css: './src/less/**/*.css',
    index: './dist/release.html',
    devIndex: './src/dev.html',
    js: 'src/coffee/**/*.js',
    coffee: './src/coffee/**/*.coffee',
    less: '.src/less/**/.less'
};

var regex = {
    jsMin: /(js\\\*\*\\\*.js)/g,
    js: /(js-dev\\\*\*\\\*.js)/g,
    inject: /(<!-- inject:js -->)[\s\S]*(<!-- endinject -->)/g, // TODO improve this
    once: /(<!-- delete -->)[\s\S]*(<!-- deleteend -->)/g
};

var regexFiles = {
    js: 'js-dev\\**\\*.js',
    jsMin: 'js\\**\\*.js',
    alljs: '<!-- inject:js -->\n<script src="dist/complete.min.js"></script>\n<!-- endinject -->'  // TODO improve this
};

gulp.task('less', function () {
    gulp.src('./less/**/*.less')
        .pipe(less({
            paths: [path.join('./custom/', 'less', 'includes')],
            sourceMap: true
        }))
        .pipe(header(extended, { pkg: pkg }))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest(paths.release))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCss({ processImport: false }))
        .pipe(gulp.dest(paths.release))
        .pipe(notify({ message: 'LESS to CSS conversion complete.' }))
        .on('error', gutil.log);
});

// Inject JS & CSS Files
gulp.task('inject', function() {
    gulp.src(files.devIndex)
        .pipe(inject(gulp.src([files.js, files.css], { read: false }))) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.src))
        .pipe(notify({ message: 'dev.html includes dynamically injected.' }))
        .on('error', gutil.log);

    gulp.src(files.index)
        .pipe(inject(gulp.src(['./dist/**/*.min*'], { read: false }))) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.release))
        .pipe(notify({ message: 'release.html includes dynamically injected.' }))
        .on('error', gutil.log);
});

// Compile and Minify JS
gulp.task('concat', function() {
    gulp.src(files.coffee)
        .pipe(coffee({ map: true }))
        .pipe(plugins.concat('complete.js'))
        .pipe(header(extended, { pkg: pkg }))
        .pipe(gulp.dest(paths.release))
        .pipe(rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(header(succint, { pkg: pkg }))
        .pipe(gulp.dest(paths.release))
        .pipe(notify({ message: 'CoffeeScript to JS compilation complete.' }))
        .on('error', gutil.log);
});

gulp.task('inject-bower', function() {
    wiredep({
        directory: './bower_components',
        bowerJson: require('./bower.json'),
        src: './dist/release.html',
        ignorePath: './',
        cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
    });

    wiredep({
        directory: './bower_components',
        bowerJson: require('./bower.json'),
        src: './src/dev.html',
        ignorePath: './',
        cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
    });

});

gulp.task('bump', function () {
    gulp.src(['./package.json', './bower.json'])
      .pipe(bump())
      .pipe(gulp.dest('./'));
});

// Tag the repo with a version
gulp.task('tag', function () {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;

    git.commit(message);
    git.tag(v, message);
    git.push('origin', 'master', '--tags');
});

gulp.task('npm', function (done) {
    require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
      .on('close', done)
      .on('error', gutil.log);
});

// Init watch
gulp.task('watch', function () {
    gulp.watch(files.js, ['inject']);
        //.pipe(notify({ message: 'Includes updated.' }));
});

gulp.task('release-version', ['bump', 'tag']);
gulp.task('init', ['inject-bower']);
gulp.task('default', ['inject']);
gulp.task('build', ['concat', 'watch']);