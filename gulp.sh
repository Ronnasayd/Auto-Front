#!/bin/bash
file="./package.json"
if [ ! -f "$file" ]
then
  yarn add --no-bin-links gulp
  yarn add --no-bin-links node-sass
  yarn add --no-bin-links browser-sync
  yarn add --no-bin-links gulp-sass
  yarn add --no-bin-links gulp-rename
  yarn add --no-bin-links gulp-autoprefixer
  yarn add --no-bin-links gulp-uglify
  yarn add --no-bin-links gulp-sourcemaps
  yarn add --no-bin-links gulp-imagemin
  yarn add --no-bin-links gulp-clean-css
  yarn add --no-bin-links gulp-html-beautify
  yarn add --no-bin-links minimist
  yarn add --no-bin-links gulp-purgecss
  yarn add --no-bin-links gulp-concat
  yarn add --no-bin-links gulp-cached
  yarn add --no-bin-links gulp-eslint
  yarn add --no-bin-links gulp-if
  yarn add --no-bin-links gulp-clean
  yarn add --no-bin-links gulp-stylelint

  yarn add --no-bin-links stylelint
  yarn add --no-bin-links eslint-config-google
  yarn add --no-bin-links stylelint-config-standard
  gulp
else
  yarn --no-bin-links
  gulp
fi
