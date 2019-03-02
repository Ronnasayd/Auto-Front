const gulp            = require("gulp");
const browserSync     = require("browser-sync").create();
const sass            = require("gulp-sass");
const rename          = require("gulp-rename");
const autoprefixer    = require("gulp-autoprefixer");
const uglify          = require("gulp-uglify");
const sourcemaps      = require("gulp-sourcemaps");
const imagemin        = require("gulp-imagemin");
const cleanCSS        = require("gulp-clean-css");
const htmlbeautify    = require("gulp-html-beautify");
const purgecss        = require("gulp-purgecss");
const cache           = require("gulp-cached");
const minimist        = require("minimist");
const concat          = require("gulp-concat");
const eslint          = require("gulp-eslint");
const gulpIf          = require("gulp-if");
const clean           = require("gulp-clean");

const gulpStylelint   = require('gulp-stylelint');


const src_scss        = "app/static/src/scss/**/*.scss";
const src_css         = "app/static/src/css/**/*.css";
const src_js          = "app/static/src/js/**/*.js";
const src_images      = "app/static/src/images/**/*.{png,jpeg,jpg,svg,icon}";
const src_fonts       = "app/static/src/fonts/**";
const src_libs        = "app/static/src/libs/**";

const not_node        = "!node_modules/"

const tmp_css         = "app/static/tmp/css/"

const dist_js         = "app/static/dist/js/"
const dist_css        = "app/static/dist/css/"
const dist_images     = "app/static/dist/images/"
const dist_fonts      = "app/static/dist/fonts/"
const dist_libs       = "app/static/dist/libs"

const html_files      = "app/**/*.html"

const copyLibs = () =>{
    return gulp.src([src_libs,not_node],{allowEmpty: true})
    .pipe(cache("copyLibs"))
    .pipe(gulp.dest(dist_libs))
}

const copyImages = () =>{
    return gulp.src([src_images,not_node],{allowEmpty: true})
    .pipe(cache("copyImages"))
    .pipe(gulp.dest(dist_images))
}

const copyFonts = () =>{
    return gulp.src([src_fonts,not_node],{allowEmpty: true})
    .pipe(cache("copyFonts"))
    .pipe(gulp.dest(dist_fonts))
}

const styleLint = ()=> {   
    return gulp.src([src_css,not_node],{base: "./", allowEmpty: true})
    .pipe(cache("styleLint"))
    .pipe(gulpStylelint({fix: true}))
    .pipe(gulp.dest('./'))
}


const esLint = ()=>{
    return gulp.src([src_js,not_node],{base: "./",allowEmpty: true})
    .pipe(cache("esLint"))
    .pipe(eslint({fix:true}))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest("./")))
    .pipe(eslint.failAfterError());
}

const minifyJs = ()=>{
    return gulp.src([src_js,not_node],{allowEmpty: true})
    .pipe(cache("minifyJs"))
    .pipe(sourcemaps.init())
    .pipe(uglify()).on("error",function(err){
            console.log(err.message);
            console.log(err.cause);
            browserSync.notify(err.message, 3000); // Display error in the browser
            this.emit("end"); // Prevent gulp from catching the error and exiting the watch process
     })
    .pipe(rename(function(file){
            file.extname = ".min.js"
     }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(dist_js))
}

const sassToCss = ()=>{
    return gulp.src([src_scss,"!_*.scss",not_node],{allowEmpty: true})
        .pipe(cache("sassToCss"))
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            indentedSyntax: false,
        }).on("error",function(err){
            console.log(err.message);
            browserSync.notify(err.message, 3000); // Display error in the browser
            this.emit("end"); // Prevent gulp from catching the error and exiting the watch process
        }))
        .pipe(autoprefixer({
            browsers: ["last 100 versions"],
            cascade: false
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(tmp_css))
}

const copySrcCss = ()=>{
    return gulp.src([src_css,not_node],{allowEmpty: true})
    .pipe(cache("copySrcCss"))
    .pipe(gulp.dest(tmp_css))
}

const minifyCss = ()=>{
    return gulp.src([tmp_css+"**/*.css",not_node],{allowEmpty: true})
    .pipe(cache("minifyCss"))
    .pipe(sourcemaps.init())
    .pipe(purgecss({
        content: [html_files,not_node]
    }))
    .pipe(cleanCSS())
    .pipe(rename(function(file){
        file.extname = ".min.css"
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(dist_css))
    .pipe(browserSync.stream())
}


const deleteTempCss = ()=>{
    return gulp.src(["app/static/tmp/",not_node], {read: false, base: "./", allowEmpty: true})
            .pipe(clean());
}


//  gulp concatfiles --files <list_of_files:file1,file2,file3> --name <name_of_file:all.js> --dist <destination>
const concatFiles = ()=>{
    let options = minimist(process.argv.slice(2));
    console.log("files: "+options.files);
    console.log("name: "+options.name);
    console.log("dist: "+options.dist);
    return gulp.src(options.files.split(","),{base: "./",allowEmpty: true})
    .pipe(cache("concatFiles"))
    .pipe(sourcemaps.init())
    .pipe(concat(options.name))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(options.dist))
}



const htmlBeautify = ()=>{
    const options = {
        indentSize: 2,
        indent_with_tabs: false,
        indent_char: " ",
      };
    return gulp.src([html_files,not_node],{base: "./",allowEmpty: true})
    .pipe(cache("htmlBeautify"))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest("./"))
}

const browserReload = (done)=>{
    browserSync.reload();
    done();
}

const isFixed = (file) => {
    // Has ESLint fixed the file contents?
    return file.eslint != null && file.eslint.fixed;
}


const minifyImages =()=>{
    return gulp.src([src_images,not_node],{base: "./",allowEmpty: true})
    .pipe(cache("minifyImages"))
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
    .pipe(gulp.dest("./"))
}


const js_line = gulp.series(esLint,minifyJs);
const css_line = gulp.series(styleLint, gulp.parallel(sassToCss, copySrcCss), minifyCss, deleteTempCss);
const image_line = gulp.series(minifyImages,copyImages);
const html_line = gulp.parallel(htmlBeautify);
const fonts_line = gulp.series(copyFonts);
const libs_line = gulp.series(copyLibs)


const browserSyncServer = ()=>{
    browserSync.init({
        open: false,
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch("app/static/src/**/*.{scss,css}", css_line);
    gulp.watch(src_js, gulp.series(js_line,browserReload));
    gulp.watch(src_images, image_line);
    gulp.watch(src_fonts, fonts_line);
    gulp.watch(src_libs, libs_line);
    gulp.watch(html_files, gulp.parallel(html_line,browserReload));
}

const server = gulp.series(gulp.parallel(js_line,css_line,image_line,fonts_line,libs_line,html_line),browserSyncServer)

exports.concatfiles = concatFiles
exports.default  = server
