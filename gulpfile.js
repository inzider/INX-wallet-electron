/*
 * INX Wallet
 * File organiser and project optimiser.
 */

let del = require("del");
let gulp = require("gulp");
let pump = require("pump");
let scss = require("gulp-sass");
let uglify = require('gulp-uglify');
let concat = require("gulp-concat");
let htmlmin = require("gulp-htmlmin");

/*
 *  Configurations
 */

// Config HTML
const htmlSrcPath = "./src/html/";
const htmlDestPath = "./www/";

// Config SCSS
const scssMainFile = "main.scss";
const scssSrcPath = "./src/scss/";
const scssDestPath = "./www/assets/css/";

// Config LIBS
const libsFileName = "libs.js";
const libsSrcPath = "./src/libs/";
const libsDestPath = "./www/assets/scripts/";
const libsFiles = [
	libsSrcPath + "angular.js",
	libsSrcPath + "angular-route.js",
	libsSrcPath + "angular-touch.js",
	libsSrcPath + "angular-animate.js",
  libsSrcPath + "TweenLite.js",
	libsSrcPath + "CSSPlugin.js",
];

// Config APP
const appFileName = "app.js";
const appSrcPath = "./src/app/";
const appDestPath = "./www/assets/scripts/";

// Config FONTS
const fontSrcPath = "./src/fonts/";
const fontDestPath = "./www/assets/fonts/";
const fontTypes = [
  fontSrcPath + "**/*.woff",
  fontSrcPath + "**/*.woff2",
  fontSrcPath + "**/*.ttf",
  fontSrcPath + "**/*.oet",
  fontSrcPath + "**/*.svg"
];

// Config IMAGES
const imageSrcPath = "./src/images/";
const imageDestPath = "./www/assets/images/";
const imageTypes = [
  imageSrcPath + "**/*.bmp",
  imageSrcPath + "**/*.gif",
  imageSrcPath + "**/*.jpeg",
  imageSrcPath + "**/*.jpg",
  imageSrcPath + "**/*.png",
  imageSrcPath + "**/*.svg"
];

/*
 *  End Configurations
 */

/* ------------------------------------------------- */

gulp.task("clean", function(){
  return del("www/**", { force: true });
});

/* ------------------------------------------------- */

// Minify HTML
gulp.task("html:minify", function (cb) {
  pump([
    gulp.src(htmlSrcPath + "**/*.html"),
    htmlmin({collapseWhitespace: true}),
    gulp.dest(htmlDestPath)
  ], cb);
});

// Watch HTML
gulp.task("html:watch", function () {
  gulp.watch(htmlSrcPath + "**/*.html", ["html:minify"]);
});

/* ------------------------------------------------- */

// Compile SCSS
gulp.task("scss:compile", function (cb) {
  pump([
    gulp.src(scssSrcPath + scssMainFile),
    scss({outputStyle: "compressed"}),
    gulp.dest(scssDestPath)
  ], cb);
});

// Watch SCSS
gulp.task("scss:watch", function () {
  gulp.watch(scssSrcPath + "**/*.scss", ["scss:compile"]);
});

/* ------------------------------------------------- */

// Optimize LIBS
gulp.task("libs:optimize", function (cb) {
  pump([
    gulp.src(libsFiles),
    concat(libsFileName),
    uglify({ mangle: false }),
    gulp.dest(libsDestPath)
  ], cb);
});

// Watch LIBS
gulp.task("libs:watch", function () {
  gulp.watch(libsSrcPath + "**/*.js", ["libs:optimize"]);
});

/* ------------------------------------------------- */

// Optimize APP
gulp.task("app:optimize", function (cb) {
  pump([
    gulp.src(appSrcPath + "**/*.js"),
    concat(appFileName),
    uglify({ mangle: false }),
    gulp.dest(appDestPath)
  ], cb);
});

// Watch APP
gulp.task("app:watch", function () {
  gulp.watch(appSrcPath + "**/*.js", ["app:optimize"]);
});

/* ------------------------------------------------- */

// Organize FONTS
gulp.task("fonts:assets", function (cb) {
  pump([
    gulp.src(fontTypes),
    gulp.dest("./www/assets/fonts/")
  ], cb);
});

// Watch FONTS
gulp.task("fonts:watch", function () {
  gulp.watch(fontTypes, ["fonts:assets"]);
});

/* ------------------------------------------------- */

// Organize IMAGES
gulp.task("images:assets", function (cb) {
  pump([
    gulp.src(imageTypes),
    gulp.dest(imageDestPath)
  ], cb);
});

// Watch IMAGES
gulp.task("images:watch", function () {
  gulp.watch(imageTypes, ["images:assets"]);
});

/* ------------------------------------------------- */

// Compile Task
gulp.task("compile", [
  
  "html:minify",
  "scss:compile",
  "libs:optimize",
  "app:optimize",
  "fonts:assets",
  "images:assets"
]);

// Watch Task
gulp.task("watch", [
  
  "html:watch",
  "scss:watch",
  "libs:watch",
  "app:watch",
  "fonts:watch",
  "images:watch"
]);

// Default Task
gulp.task("default", ["compile", "watch"]);
