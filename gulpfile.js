var gulp = require('gulp');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var vulcanize = require('gulp-vulcanize');
var templateCache = require('gulp-angular-templatecache');

var paths = {
    js: [ 
        'src/checkbox/checkbox.js', 
        'src/unitinput/unitinput.js',
        'src/editor-ui.js',
    ],
    css: 'src/**/*.styl',
    html: 'src/**/*.html',
};

// clean
gulp.task('clean', function() {
    return gulp.src('bin/**/*', {read: false})
    .pipe(clean())
    ;
});

// js
gulp.task('js', function() {
    return gulp.src(paths.js, {base: 'src'})
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('editor-ui.js'))
    .pipe(uglify())
    .pipe(gulp.dest('bin'))
    ;
});

// css
gulp.task('css', function() {
    return gulp.src('src/editor-ui.styl')
    .pipe(stylus({
        compress: true,
        include: 'src'
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// html
gulp.task('html', function() {
    return gulp.src(paths.html)
    .pipe(templateCache('editor-ui-templates.js', {
        module: 'fireUI',
        standalone: false,
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// watch
gulp.task('watch', function() {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.html, ['html']);
});

// tasks
gulp.task('default', ['js', 'css', 'html'] );
