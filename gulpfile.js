const {src, dest, series, parallel, watch} = require('gulp');
const yarg = require('yargs');
const gulpif = require('gulp-if');
const del = require('del');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');


const PRODUCTION = yarg.argv.prod;

const paths = {
    style: {
        src: 'src/assest/scss/**/*.scss',
        dest: 'dist/assest/css'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'dist'
    },
    script: {
        src: 'src/assest/js/**/*.js',
        dest: 'dist/assest/js'
    },
    font: {
        src: 'node_modules/@fortawesome/fontawesome-free/webfonts/**',
        dest: 'dist/assest/css/webfonts'
    },
    fontawesomeCss: {
        src: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
        dest: 'dist/assest/css/fontawesome'
    },
    pluginCss: {
        src: [
            'node_modules/normalize.css/normalize.css',
            'node_modules/animate.css/animate.min.css',
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
        ],
        dest: 'dist/assest/css'
    },
    pluginJs: {
        src: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/owl.carousel/dist/owl.carousel.min.js',
            'node_modules/wow.js/dist/wow.min.js',
        ],
        dest: 'dist/assest/js'
    },
    images: {
        src: 'src/assest/img/**/*',
        dest: 'dist/assest/img'
    }
}

const clean = () => del('dist');


const html = () => {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest));
}

const style = () => {
    return src(paths.style.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest(paths.style.dest))
        .pipe(browserSync.stream());
}

const script = () => {
    return src(paths.script.src)
        .pipe(webpack({
            module: {
                rules: [
                  {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: ['@babel/preset-env']
                      }
                    }
                  }
                ]
              },
              output: {
                filename: 'bundle.js',
              },
              mode: 'development'
        }))
        .pipe(dest(paths.script.dest))
        .pipe(browserSync.stream());
}

const images = () => {
    return src(paths.images.src)
        .pipe(dest(paths.images.dest));
}

const pluginCss = () => {
    return src(paths.pluginCss.src)
        .pipe(dest(paths.pluginCss.dest));
}

const pluginJs = () => {
    return src(paths.pluginJs.src)
        .pipe(dest(paths.pluginJs.dest));
}

const font = () => {
    return src(paths.font.src)
        .pipe(dest(paths.font.dest));
}

const fontawesomeCss = () => {
    return src(paths.fontawesomeCss.src)
        .pipe(dest(paths.fontawesomeCss.dest));
}

const watchs = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    watch('src/assest/scss/**/*.scss', style);
    watch('src/**/*.html', html).on('change', browserSync.reload);
    watch('src/assest/js/**/*.js', script);
}

exports.default =  series(clean, parallel(style, html, images, script, font, fontawesomeCss, pluginCss, pluginJs), watchs);