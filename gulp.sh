
#!/bin/bash
file="./package.json"
if [ ! -f "$file" ]
then
  yarn add gulp@3
  yarn add node-sass
  yarn add browser-sync
  yarn add gulp-sass
  yarn add gulp-rename
  yarn add gulp-autoprefixer
  yarn add gulp-uglify
  yarn add gulp-sourcemaps
  yarn add gulp-imagemin
  gulp
else
  yarn
  gulp
fi
