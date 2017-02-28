var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'angular-filesort, gulp-ng-annotate-plus'],
    replaceString: /\bgulp[\-.]/
});


//JS Tasks
gulp.task('js', function () {
    return gulp.src('build/**/*.js')
     .pipe(plugins.order([
     '*.module.js',
    ]))
    .pipe(plugins.concat('angular-object-validator.js'))
    .pipe(plugins.minify({
        ext: {
            src: '.js',
            min: '.min.js'
        }
    }))
    .pipe(gulp.dest('dist/'));
});

