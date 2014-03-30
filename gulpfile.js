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
    qunit = require('gulp-qunit'),
    header = require('gulp-header'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    js2coffee = require('gulp-js2coffee'),
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
    src: './src',
    test: './test'
};

var files = {
    css: './src/less/**/*.css',
    index: './dist/release.html',
    devIndex: './src/dev.html',
    testIndex: './test/test.html',
    testIndexCoffee: './test/test.coffee.html',
    js: 'src/coffee/**/*.js',
    coffee: './src/coffee/**/*.coffee',
    less: '.src/less/**/*.less',
    test: './test/**/*.coffee*/'
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
        .pipe(inject(gulp.src([files.js, files.css], { read: false }), { addRootSlash: false, addPrefix: '..' })) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.src))
        .pipe(notify({ message: 'dev.html includes dynamically injected.' }))
        .on('error', gutil.log);

    gulp.src(files.testIndexCoffee)
        .pipe(inject(gulp.src([files.coffee, files.test, files.css], { read: false}), { addRootSlash: false, addPrefix: '..' })) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.test))
        .pipe(notify({ message: 'test.coffee.html includes dynamically injected.' }))
        .on('error', gutil.log);

    gulp.src(files.testIndex)
        .pipe(inject(gulp.src([files.js, './test/**/*.js*/', files.css], { read: false}), { addRootSlash: false, addPrefix: '..' })) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.test))
        .pipe(notify({ message: 'test.html includes dynamically injected.' }))
        .on('error', gutil.log);	
        
    gulp.src(files.index)
        .pipe(inject(gulp.src(['./dist/**/*.min*'], { read: false }), { addRootSlash: false, addPrefix: '..' })) // Not necessary to read the files (will speed up things), we're only after their paths
        .pipe(gulp.dest(paths.release))
        .pipe(notify({ message: 'release.html includes dynamically injected.' }))
        .on('error', gutil.log);
});

// Compile and Minify JS
gulp.task('concat', function() {
    var pkg = require('./package.json');
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
        src: './dist/release.html'
    });

    wiredep({
        directory: './bower_components',
        bowerJson: require('./bower.json'),
        src: './src/dev.html'
    });

    wiredep({
        directory: './bower_components',
        bowerJson: require('./bower.json'),
        src: './test/test.html'
    });

    wiredep({
        directory: './bower_components',
        bowerJson: require('./bower.json'),
        src: './test/test.coffee.html'
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
    git.add();
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
    //gulp.watch(files.js, ['inject']);
    gulp.watch(files.coffee, ['concat', 'inject']);
    gulp.watch(files.test, ['concat', 'inject']);
    gulp.watch(files.css, ['concat', 'inject']);
    
});

gulp.task('test', function () {
    return gulp.src('./test/test.html')
        .pipe(qunit());
});

gulp.task('js2coffee', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(js2coffee())
        //.pipe(plumber())
        .pipe(gulp.dest('./src'));
});

gulp.task('release-version', ['bump', 'tag']);
gulp.task('init', ['inject-bower']);
gulp.task('build', ['concat', 'inject', 'watch']);

gulp.task('default', ['build']);