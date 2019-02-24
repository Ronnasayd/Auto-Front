
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var rename          = require('gulp-rename');
var autoprefixer    = require('gulp-autoprefixer');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');
var imagemin        = require('gulp-imagemin');

// Static Server + watching scss/html files
gulp.task('serve', ['sass','js'], function() {

   
    browserSync.init({
        open: false,
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("app/static/scss/*.scss", ['sass']);
    gulp.watch("app/static/js/*.js", ['js']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/static/css/*.css").on('change', browserSync.reload);
    gulp.watch(["app/static/jsmin/*.js"]).on('change', browserSync.reload);
});


gulp.task('js',function(){
    return gulp.src(["app/static/js/*.js"])
    .pipe(sourcemaps.init())
    .pipe(uglify()).on('error',function(err){
            console.log(err.message);
            console.log(err.cause);
            browserSync.notify(err.message, 3000); // Display error in the browser
            this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
     })
    .pipe(rename(function(file){
            file.extname = ".min.js"
     }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("app/static/jsmin"))
});

gulp.task('imagemin',function(){
  return gulp.src(["app/static/images"])
  .pipe(imagemin({verbose:true}))
  .pipe(gulp.dest("."))
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(["app/static/scss/*.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            indentedSyntax: false,
            outputStyle: 'compressed'
        }).on('error',function(err){
            console.log(err.message);
            browserSync.notify(err.message, 3000); // Display error in the browser
            this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
        }))
        .pipe(autoprefixer({
            browsers: ['last 100 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("app/static/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
