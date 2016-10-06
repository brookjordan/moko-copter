// generated on 2016-08-16 using generator-webapp 2.1.0
const gulp              = require('gulp');
const gulpLoadPlugins   = require('gulp-load-plugins');
const browserSync       = require('browser-sync');
const del               = require('del');
const rollup            = require('rollup-stream');
const source            = require('vinyl-source-stream');
const buffer            = require('vinyl-buffer');
const extReplace        = require('gulp-ext-replace');
const ftp               = require( 'vinyl-ftp' );
const gutil             = require('gulp-util');
const babel             = require('rollup-plugin-babel');
const nodeResolve       = require('rollup-plugin-node-resolve');
const commonjs          = require('rollup-plugin-commonjs');

const $             = gulpLoadPlugins();
const reload        = browserSync.reload;
const handlebars    = require('gulp-compile-handlebars');
const templateData  = require('./data.json');
const env           = require('gulp-env');

gulp.task('nodeenv', function() {
  env({
    file: '.env',
    type: 'ini',
  });
});

gulp.task('handlebars', () => {
  const options = {
    ignorePartials: true,
    batch: ['./app/templates'],
    helpers: {

    },
  };
  return gulp.src('app/index.hbs')
      .pipe(handlebars(templateData, options))
      .pipe(extReplace('.html'))
      .pipe(gulp.dest('.tmp'));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: [
        './bower_components',
      ],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return rollup({
      entry: './app/scripts/entry/main.js',
      plugins: [
        nodeResolve({
          jsnext: true,
        }),
        commonjs({

        }),
        babel({
          exclude: 'node_modules/**'
        }),
      ],
    })
    .pipe(source('main.js', './app/scripts/entry'))
    .pipe(buffer())
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({ stream: true }));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['handlebars', 'styles', 'scripts'], () => {
  return gulp.src('.tmp/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: false})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/assets/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['handlebars', 'styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.hbs',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.hbs', ['handlebars']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js*', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components',
      },
    },
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('deploy-staging', ['nodeenv', 'build'], () => {

  // IMPORTANT NOT TO CHANGE THIS
  const STAGING_ROOT_URL = '/portals/407937-tradegecko_pte_ltd/content/files/marketing-site-2016/staging/';

  const ftp_create = new ftp({
    host:           process.env.FTP_HOST,
    user:           process.env.FTP_USERNAME,
    password:       process.env.FTP_PASSWORD,
    port:           process.env.FTP_PORT,
    secure:         true,
    parallel:       1,
    maxConnections: 5,
    idleTimeout:    10000,
    log:            gutil.log,
  });

  var globs = [
    './dist/**',
    '!./dist/index.*',
    '!./dist/robots.txt'
  ];

  return gulp.src( globs, { buffer: false } )
        .pipe( ftp_create.dest( STAGING_ROOT_URL ) );
});

gulp.task('default', ['clean', 'set-env'], () => {
  gulp.start('build');
});
