/**
 * Created by jandres on 28/01/16.
 */
var path = require('path'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require("gulp-rename"),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    babel = require("gulp-babel"),
    stringify = require('stringify');

var paths = {
    js: ['./src/**/*.js'],
    less: ['./style/**/*.less'],
    templates: ['./templates/**/*.tmpl']
};

// LESS/CSS section.
gulp.task('css', function () {
    gulp.src('./style/feedback.less')
        .pipe(less({
            paths: [path.join(__dirname, 'styles', 'includes')]
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));

    // Copy images in styles directory that the stylesheets will probably need.
    gulp.src('./style/*.{ttf,woff,eof,svg,png,jpg,jpeg}')
        .pipe(gulp.dest('./dist'));
});

// JS section.
gulp.task('js', function() {
    gulp.src('./src/feedback.js')
        .pipe(browserify({
            standalone: 'feedback-tool',
            transform: stringify({ extensions: ['.tmpl'], minify: true })
        }))
        .pipe(babel())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.less, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.templates, ['js']);
});

gulp.task('default', ['css', 'js', 'watchers']);
