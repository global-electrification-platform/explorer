/* global process, Buffer, exports, require */
'use strict';

const fs = require('fs');
const cp = require('child_process');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync');
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('fancy-log');
const SassString = require('node-sass').types.String;
const notifier = require('node-notifier');
const historyApiFallback = require('connect-history-api-fallback');
const through2 = require('through2');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

const bs = browserSync.create();

// The package.json
var pkg;

// Environment
// Set the correct environment, which controls what happens in config.js
if (!process.env.DS_ENV) {
  if (!process.env.CIRCLE_BRANCH || process.env.CIRCLE_BRANCH !== process.env.PRODUCTION_BRANCH) {
    process.env.DS_ENV = 'staging';
  } else {
    process.env.DS_ENV = 'production';
  }
}

var prodBuild = false;

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
}
readPackage();

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Browserify tasks --------------------------------//
// ------------------- (Not to be called directly) ---------------------------//
// ---------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// index.js
var bundleJavascript = function () {

  var watcher =  browserify({
    entries: ['./app/assets/scripts/index.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  if (!prodBuild) {
    // If we're not doing a one off build, wrap in a watchify
    watcher = watchify(watcher, { poll: true });
  }

  function bundler () {
    if (pkg.dependencies) {
      watcher.external(Object.keys(pkg.dependencies));
    }
    return watcher.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Javascript error:', e);
        if (prodBuild) {
          process.exit(1);
        }
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/assets/scripts'))
      .pipe(bs.stream());
  }

  if (!prodBuild) {
    watcher
      .on('log', log)
      .on('update', bundler);
  }

  return bundler();
};

// Helper tasks

var styles = function () {
  return gulp.src('app/assets/styles/main.scss')
    .pipe($.plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
      console.log('Sass error:', e.toString());
      if (prodBuild) {
        process.exit(1);
      }
      // Allows the watch to continue.
      this.emit('end');
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      functions: {
        'urlencode($url)': function (url) {
          var v = new SassString();
          v.setValue(encodeURIComponent(url.getValue()));
          return v;
        }
      },
      includePaths: require('bourbon').includePaths.concat('node_modules/jeet')
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/styles'))
    // https://browsersync.io/docs/gulp#gulp-sass-maps
    .pipe(bs.stream({ match: '**/*.css' }));
};

// After being rendered by jekyll process the html files. (merge css files, etc)
var html = function () {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe(cacheUseref())
    // Do not compress comparisons, to avoid MapboxGLJS minification issue
    // https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-286277540
    // https://github.com/mishoo/UglifyJS2/issues/1609 -> Just until gulp-uglify updates
    //.pipe($.if('*.js', $.uglify({ compress: { comparisons: false, collapse_vars: false } })))
    .pipe($.if('*.js', uglify())) // this is now uglify-es
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(/\.(css|js)$/, $.rev()))
    .pipe($.revRewrite())
    .pipe(gulp.dest('dist'));
};

var imagemin = function () {
  return gulp.src([
    'app/assets/graphics/**/*'
  ])
    .pipe($.imagemin([
      $.imagemin.gifsicle({ interlaced: true }),
      $.imagemin.mozjpeg({ progressive: true }),
      $.imagemin.optipng({ optimizationLevel: 5 }),
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling.
      $.imagemin.svgo({ plugins: [{ cleanupIDs: false }] })
    ]))
    .pipe(gulp.dest('dist/assets/graphics'));

};

var fonts = function () {
  return gulp.src([
    'app/assets/fonts/**/*'
  ])
    .pipe(gulp.dest('dist/assets/fonts'));
};


// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Callable tasks ----------------------------------//
// ---------------------------------------------------------------------------//

var clean = function (cb) {
  del(['.tmp', 'dist']);
  cb();
};

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
var vendorScripts = function () {
  // Ensure package is updated.
  readPackage();
  var vb = browserify({
    debug: true,
    require: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
  });
  return vb.bundle()
    .on('error', log.bind(log, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts/'))
    .pipe(bs.stream());
};

var serve = function () {
  bs.init({
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      },
      ghostMode: false,
      open: false,
      middleware: [
        historyApiFallback()
      ]
    },
    host: '0.0.0.0'
  });
  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/assets/graphics/**/*',
    '!app/assets/icons/collecticons/**/*'
  ], bs.reload);

  gulp.watch('app/assets/styles/**/*.scss', styles);
  gulp.watch('package.json', vendorScripts);
  gulp.watch('app/assets/icons/collecticons/**', gulp.series('collecticons'));
};



// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Collecticon tasks -------------------------------//
// --------------------- (Font generation related) ---------------------------//
// ---------------------------------------------------------------------------//
gulp.task('collecticons', function (done) {
  var args = [
    'node_modules/collecticons-processor/bin/collecticons.js',
    'compile',
    'app/assets/icons/collecticons/',
    '--font-dest', 'app/assets/fonts',
    '--font-name', 'Collecticons',
    '--font-types', 'woff,woff2',
    '--style-formats', 'sass',
    '--style-dest', 'app/assets/styles/',
    '--style-name', 'collecticons',
    '--class-name', 'collecticon',
    '--author-name', 'Development Seed',
    '--author-url', 'https://developmentseed.org/',
    '--rescale',
    '--no-preview'
  ];

  return cp.spawn('node', args, { stdio: 'inherit' })
    .on('close', done);
});

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Helper tasks -----------------------------------//
// ----------------------------------------------------------------------------//
var gzip = function () {
  return gulp.src('dist/**/*')
    .pipe($.size({ title: 'build', gzip: true }))
    .pipe(gulp.dest('dist'));
};

var _prodBuild = function(cb) {
  prodBuild = true;
  cb();
};




/**
 * Caches the useref files.
 * Avoid sending repeated js and css files through the minification pipeline.
 * This happens when there are multiple html pages to process.
 */
function cacheUseref () {
  let files = {
    // path: content
  };
  return through2.obj(function (file, enc, cb) {
    const path = file.relative;
    if (files[path]) {
      // There's a file in cache. Check if it's the same.
      const prev = files[path];
      if (Buffer.compare(file.contents, prev) !== 0) {
        this.push(file);
      }
    } else {
      files[path] = file.contents;
      this.push(file);
    }
    cb();
  });
}

exports.serve =  gulp.parallel(vendorScripts, bundleJavascript, styles, serve);
exports.html = html;
exports.build = gulp.series(clean,
                            _prodBuild,
                            gulp.parallel(vendorScripts,
                                          bundleJavascript, gulp.series('collecticons', fonts)),
                            styles,
                            gulp.parallel(html, imagemin),
                            gzip);
exports.default = exports.build;
