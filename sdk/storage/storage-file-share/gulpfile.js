const gulp = require("gulp");
const zip = require("gulp-zip");

const version = require("./package.json").version;
const zipFileName = `azurestoragejs.file-${version}.zip`;

gulp.task("zip", function (callback) {
  gulp
    .src([
      "browser/azure-storage-file-share.js",
      "browser/azure-storage-file-share.min.js",
      "browser/*.txt"
    ])
    .pipe(zip(zipFileName))
    .pipe(gulp.dest("browser"))
    .on("end", callback);
});
