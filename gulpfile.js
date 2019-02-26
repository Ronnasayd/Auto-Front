
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var rename          = require('gulp-rename');
var autoprefixer    = require('gulp-autoprefixer');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');
var imagemin        = require('gulp-imagemin');

const minifiedJavascript = ()=>{
    return gulp.src(["app/static/src/js/*.js"])
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
    .pipe(gulp.dest("app/static/dist/js"))

}

const minifiedImages =()=>{
    return gulp.src(["app/static/src/images"])
    .pipe(imagemin({verbose:true}))
    .pipe(gulp.dest("app/static/dist/images/"))
}

const minifiedCss = ()=>{
    return gulp.src(["app/static/src/scss/*.scss"])
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
        .pipe(gulp.dest("app/static/dist/css"))
        .pipe(browserSync.stream());

}

const browserSyncServer = ()=>{
    browserSync.init({
        open: false,
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("app/static/src/scss/*.scss", gulp.series(minifiedCss));
    gulp.watch("app/static/src/js/*.js", gulp.series(minifiedJavascript));
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/static/dist/css/*.css").on('change', browserSync.reload);
    gulp.watch("app/static/dist/js/*.js").on('change', browserSync.reload);

}

const minifiedAssets = gulp.parallel([minifiedCss,minifiedJavascript,minifiedImages])
const server = gulp.series(browserSyncServer,minifiedAssets)

exports.default  = server
