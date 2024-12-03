const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('minify-js', function() {
    return gulp.src('public/js/app.js') 
        .pipe(uglify()) 
        .pipe(rename('app.min.js')) 
        .pipe(gulp.dest('public/js')); 
});

gulp.task('minify-css', function() {
    return gulp.src('public/css/style.css') 
        .pipe(cleanCSS()) 
        .pipe(rename('style.min.css')) 
        .pipe(gulp.dest('public/css')); 
});

gulp.task('default', gulp.series('minify-js', 'minify-css'));