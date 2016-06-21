var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	jshint = require('gulp-jshint'),
	plumber = require('gulp-plumber'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');

//样式
gulp.task('styles', function() {
	return sass('sass/duobao.scss', { style: 'expanded' })
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	    .pipe(gulp.dest('dist/css'))
	    .pipe(rename({suffix: '.min'}))
	    .pipe(minifycss())
	    .pipe(gulp.dest('dist/css'))
	    .pipe(notify({ message: 'Styles task complete' }));
});

// 脚本
gulp.task('scripts', function() {  
	return gulp.src('js/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {  
	return gulp.src('images/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

//清理文件
gulp.task('clean', function() {
    return del('dist/assets/css');
});

// 预设任务
gulp.task('default', ['clean'], function() {  
    gulp.start('styles', 'scripts');
});