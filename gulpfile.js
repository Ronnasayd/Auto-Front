
const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const sass            = require('gulp-sass');
const rename          = require('gulp-rename');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const sourcemaps      = require('gulp-sourcemaps');
const imagemin        = require('gulp-imagemin');
const cleanCSS        = require('gulp-clean-css');
const htmlbeautify    = require('gulp-html-beautify');
const purgecss        = require('gulp-purgecss');
const cache           = require('gulp-cached');
const minimist        = require('minimist');
const concat          = require('gulp-concat');

//  gulp concatfiles --files <list_of_files:file1,file2,file3> --name <name_of_file:all.js> --dist <destination>
const concatFiles = ()=>{
    let options = minimist(process.argv.slice(2));
    console.log("files: "+options.files+"\nname: "+options.name+"\ndist: "+options.dist);
    return gulp.src(options.files.split(","))
    .pipe(cache('concatcss'))
    .pipe(sourcemaps.init())
    .pipe(concat(options.name))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(options.dist))
}


const unusedCss = ()=>{
    return gulp.src(["app/static/dist/css/**/*.css","!app/static/dist/css/**/*clean.css"],{base: './'})
    .pipe(cache('cssclean'))
    .pipe(sourcemaps.init())
    .pipe(purgecss({
        content: ["app/**/*.html"]
    }))
    .pipe(rename(function(file){
        file.extname = ".clean.css"
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}

const htmlBeauty = ()=>{
    const options = {
        indentSize: 2,
      };
    return gulp.src('app/**/*.html',{base: './'})
    .pipe(cache('html'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./'))
}

const minifiedCss = ()=>{
    return gulp.src(["app/static/dist/css/**/*.css","!app/static/dist/css/**/*min.css","!app/static/dist/css/**/*clean.css"])
    .pipe(cache('csstocssmin'))
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
    .pipe(cache('javascript'))
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
        .pipe(cache('csstosass'))
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
        .pipe(browserSync.stream());
        

}

const browserSyncServer = ()=>{
    browserSync.init({
        open: false,
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("app/static/src/scss/**/*.scss", gulp.series(sassToCss, minifiedCss, unusedCss));
    gulp.watch("app/static/src/js/**/*.js", gulp.series(minifiedJavascript));
    gulp.watch("app/**/*.html").on('change', gulp.series(htmlBeauty, browserSync.reload));
    gulp.watch("app/static/dist/js/**/*.js").on('change', browserSync.reload);

}

const minifiedAssets = gulp.parallel(gulp.series(sassToCss, minifiedCss, unusedCss), minifiedJavascript)
const server = gulp.series(htmlBeauty, minifiedAssets, browserSyncServer)

exports.imagemin = minifiedImages
exports.concatfiles = concatFiles
exports.default  = server
