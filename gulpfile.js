import gulp from "gulp";
import gulpif from "gulp-if";
import concat from "gulp-concat";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";

const common = (minify = false) =>
  gulp
    .src("src/**/*.css")
    .pipe(concat("mini.css"))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulpif(minify, cleanCSS()))
    // TODO: move under "public" once Dioxus is fixed
    .pipe(gulp.dest("assets"));

gulp.task("dev", () => common());
gulp.task("prod", () => common(true));
gulp.task("default", () => gulp.watch("src/**/*.css", gulp.series("dev")));
