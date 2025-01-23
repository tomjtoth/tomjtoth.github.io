import concat from "gulp-concat";
import cleanCSS from "gulp-clean-css";
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";

export default () =>
  gulp
    .src("src/**/*.css")
    .pipe(concat("mini.css"))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("assets"));
