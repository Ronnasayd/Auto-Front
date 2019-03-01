
const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const sass            = require('gulp-sass');
const rename          = require('gulp-rename');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const sourcemaps      = require('gulp-sourcemaps');
const imagemin        = require('gulp-imagemin');
const cleanCSS        = require('gulp-clean-css');



const minifiedCss = ()=>{
    return gulp.src(["app/static/dist/css/**/*.css","!app/static/dist/css/**/*min.css"])
    .pipe(sourcemaps.init())
    .pipe(rename(function(file){
        file.extname = ".min.css"
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("app/static/dist/css"))
    .pipe(browserSync.stream());
}


const minifiedJavascript = ()=>{
    return gulp.src(["app/static/src/js/**/*.js","!app/static/src/js/**/_*.js"])
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


const sassToCss = ()=>{
    return gulp.src(["app/static/src/scss/**/*.scss","!app/static/src/scss/**/_*.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            indentedSyntax: false,
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
        

}

const browserSyncServer = ()=>{
    browserSync.init({
        open: false,
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("app/static/src/scss/**/*.scss", gulp.series(sassToCss,minifiedCss));
    gulp.watch("app/static/src/js/**/*.js", gulp.series(minifiedJavascript));
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/static/dist/js/**/*.js").on('change', browserSync.reload);

}

const minifiedAssets = gulp.parallel(gulp.series(sassToCss,minifiedCss),minifiedJavascript)
const server = gulp.series(minifiedAssets,browserSyncServer)

exports.imagemin = minifiedImages
exports.default  = server
