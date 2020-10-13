/* eslint-disable no-param-reassign */
const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const minifyjs = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const cache = require("gulp-cached");
const sassPartials = require("gulp-sass-partials-imported");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");
const path = require("path");
const eslint = require("gulp-eslint");
const webp = require("gulp-webp");

class GulpBase {
  // eslint-disable-next-line no-undef
  constructor(rootDirectory = path.resolve(__dirname, "example")) {
    this.rootDirectory = rootDirectory;

    this.sourceScssPath = path.resolve(this.rootDirectory, "src", "scss");
    this.sourceScssFiles = path.resolve(this.sourceScssPath, "**", "*.scss");

    this.sourceCssPath = path.resolve(this.rootDirectory, "src", "css");
    this.sourceCssFiles = path.resolve(this.sourceCssPath, "**", "*.css");

    this.sourceImagesPath = path.resolve(this.rootDirectory, "src", "images");
    this.sourceImagesFiles = path.resolve(
      this.sourceImagesPath,
      "**",
      "*.{png,jpeg,jpg,tiff,webp}"
    );

    this.sourceJavascriptPath = path.resolve(this.rootDirectory, "src", "js");
    this.sourceJavascriptFiles = path.resolve(
      this.sourceJavascriptPath,
      "**",
      "*.js"
    );

    this.nonIncludeNodeModules = "!node_modules/";

    this.destinationJavascript = path.resolve(
      this.rootDirectory,
      "assets",
      "js"
    );
    this.destinationCss = path.resolve(this.rootDirectory, "assets", "css");
    this.destinationImages = path.resolve(
      this.rootDirectory,
      "assets",
      "images"
    );

    this.handleBuildAssembly();
  }

  handleBuildAssembly() {
    this.javascriptAssembly = gulp.series(this.handleWebPackJs.bind(this));
    this.sassAssembly = gulp.series(this.handleSassToCssMinify.bind(this));
    this.cssAssembly = gulp.series(this.handleMinifyCss.bind(this));
    this.imagesAssembly = gulp.series(this.handleMinifyImages.bind(this));
  }

  handleMinifyImages() {
    return gulp
      .src([this.sourceImagesFiles, this.nonIncludeNodeModules], {
        allowEmpty: true,
      })
      .pipe(cache("handleMinifyImages"))
      .pipe(webp())
      .pipe(gulp.dest(this.destinationImages));
  }

  handleMinifyJs() {
    return gulp
      .src([this.sourceJavascriptFiles, this.nonIncludeNodeModules], {
        allowEmpty: true,
      })
      .pipe(cache("handleMinifyJs"))
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .pipe(sourcemaps.init())
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(minifyjs())
      .pipe(
        rename((file) => {
          file.extname = ".min.js";
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(this.destinationJavascript));
  }

  handleWebPackJs() {
    let basename;
    return gulp
      .src([this.sourceJavascriptFiles, this.nonIncludeNodeModules], {
        allowEmpty: true,
      })
      .pipe(cache("handleWebpackJs"))
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .pipe(sourcemaps.init())
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(
        rename((file) => {
          basename = file.basename;
        })
      )
      .pipe(
        webpack({
          mode: "production",
          devtool: "source-map",
          output: {
            filename: () => {
              return `${basename}.min.js`;
            },
          },
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(this.destinationJavascript));
  }

  handleSassToCssMinify() {
    return gulp
      .src([this.sourceScssFiles, this.nonIncludeNodeModules], {
        allowEmpty: true,
      })
      .pipe(cache("handleSassToCssMinify"))
      .pipe(sassPartials(this.sourceScssPath))
      .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
      .pipe(
        sass({
          errLogToConsole: true,
          indentedSyntax: false,
        })
      )
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(
        rename((file) => {
          file.extname = ".min.css";
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(this.destinationCss));
  }

  handleMinifyCss() {
    return gulp
      .src([this.sourceCssFiles, this.nonIncludeNodeModules], {
        allowEmpty: true,
      })
      .pipe(cache("handleMinifyCss"))
      .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(
        rename((file) => {
          file.extname = ".min.css";
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(this.destinationCss));
  }

  run() {
    gulp.watch(this.sourceScssFiles, this.sassAssembly);
    gulp.watch(this.sourceCssFiles, this.cssAssembly);
    gulp.watch(this.sourceJavascriptFiles, this.javascriptAssembly);
    gulp.watch(this.sourceImagesFiles, this.imagesAssembly);

    this.default = gulp.parallel(
      this.javascriptAssembly,
      this.cssAssembly,
      this.sassAssembly,
      this.imagesAssembly
    );
  }
}

const gulpBase = new GulpBase();
gulpBase.run();

exports.default = gulpBase.default;
