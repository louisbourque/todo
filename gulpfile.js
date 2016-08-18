const gulp = require('gulp');
const minifycss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concatcss = require('gulp-concat-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const minifyhtml = require('gulp-minify-html');
const eslint = require('gulp-eslint');
const htmlreplace = require('gulp-html-replace');

gulp.task('default', ['js','css','html']);

// CSS minification task
gulp.task('css', function() {
  return gulp.src(['src/css/*.css',
                  'node_modules/font-awesome/css/font-awesome.min.css',
                'node_modules/jquery-ui/themes/base/all.css'])
    .pipe(minifycss())//need to minify twice, concat fails due to commented out code.
    .pipe(concatcss('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});
// JS minification task
gulp.task('js', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.js',
                  'node_modules/jquery-ui/dist/jquery-ui.js',
                  'node_modules/underscore/underscore.js',
                  'node_modules/backbone/backbone.js',
                  'node_modules/backbone.localstorage/backbone.localStorage.js',
                  'src/js/models/*.js',
                  'src/js/collections/*.js',
                  'src/js/views/*.js',
                  'src/js/routers/*.js',
                  'src/js/*.js'])
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('js'));
});

// Image optimization task
gulp.task('img', function () {
  return gulp.src('src/img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('img'));
});

// minify HTML task
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(htmlreplace({
        'css': 'css/style.min.css',
        'js': 'js/bundle.min.js'
    }))
    .pipe(minifyhtml())
    .pipe(gulp.dest(''));
});


gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
        rules: {
            'strict': 1
        },
        globals: [
            'jQuery',
            '$'
        ],
        envs: [
            'browser'
        ]
    }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
