var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');


gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:1337", // port of node server
    });
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch("views/*.pug").on('change', browserSync.reload);
    gulp.watch("public/javascripts/*.js").on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({script: './app.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});
