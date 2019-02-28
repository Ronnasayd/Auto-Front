
const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const sass            = require('gulp-sass');
const rename          = require('gulp-rename');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const sourcemaps      = require('gulp-sourcemaps');
const imagemin        = require('gulp-imagemin');
const purgecss        = require('gulp-purgecss')

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
    return gulp.src(["app/static/images/**"],{allowEmpty: true})
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest("app/static/images"))
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
        .pipe(purgecss({
            content: ["app/**/*.html"]
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
    gulp.watch("app/static/dist/js/*.js").on('change', browserSync.reload);

}

const minifiedAssets = gulp.parallel(minifiedCss,minifiedJavascript)
const server = gulp.series(minifiedAssets,browserSyncServer)

exports.imagemin = minifiedImages
exports.default  = server
