import browserSync from "browser-sync";
import { src, dest, parallel, series, watch } from "gulp";
import babel from "gulp-babel"
import terser from "gulp-terser";
import htmlmin from "gulp-htmlmin";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";
import gulpIf from "gulp-if";
import concat from "gulp-concat";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import changed from "gulp-changed";
import { deleteAsync } from "del";
import chalk from "chalk";

const server = browserSync.create("honee-bee");
const sass = gulpSass(dartSass);
const PORT = 9000;

console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
console.log("isProd", isProd);

const paths = {
  scripts: {
    src: "src/scripts/**/*.{js,mjs,cjs}",
    dest: "dist/scripts/",
  },
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/scss/main.scss",
    watch: "src/scss/**/*.scss",
    dest: "dist/styles/",
  },
  images: {
    src: "src/images/**/*.{png,jpg,jpeg,svg}",
    dest: "dist/images/",
  },
  fonts: {
    src: "src/fonts/*",
    dest: "dist/fonts/",
  },
};

function serve() {
  server.init(
    {
      port: PORT,
      open: false,
      notify: false,
      logLevel: "warn",
      server: {
        baseDir: "dist/",
      },
      logPrefix: chalk.bold.yellow("honee-bee".toUpperCase()),
    },
    () =>
      console.log(
        chalk.blue.bold(`Сервер разработки успешно запущен на порту ${PORT}`)
      )
  );
  watch(paths.scripts.src, scripts);
  watch(paths.html.src, html);
  watch(paths.styles.watch, styles);
  watch(paths.images.src, images);
}

export function clean() {
  return deleteAsync(["dist/**", "!dist"]);
}

export function scripts() {
  return src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ["@babel/env"]
  }))
  .pipe(concat("all.js"))
  .pipe(terser())
  .pipe(rename({extname: ".min.js"}))
  .pipe(sourcemaps.write("."))
  .pipe(dest(paths.scripts.dest))
  .pipe(server.stream())
}

export function html() {
  return src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.html.dest))
    .pipe(server.stream());
}

export function styles() {
  return src(paths.styles.src)
    .pipe(changed(paths.styles.dest))
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("main.min.css"))
    .pipe(gulpIf(isProd, autoPrefixer({ cascade: false })))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpIf(!isProd, sourcemaps.write(".")))
    .pipe(dest(paths.styles.dest))
    .pipe(server.stream());
}

export function images() {
  return src(paths.images.src, {encoding: false})
    .pipe(changed(paths.images.dest))
    .pipe(dest(paths.images.dest))
    .pipe(server.stream());
}

export function copyFonts() {
  return src(paths.fonts.src, { encoding: false }).pipe(dest(paths.fonts.dest));
}

export default parallel(serve);
