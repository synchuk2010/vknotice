module.exports = function(grunt) {

	// 1. Вся настройка находится здесь
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('src/manifest.json'),

		sass: {
			options: {
				sourceMap: true
			},
			opt: {
				files: {
					'src/options/css/style.css': 'src/options/css/style.scss'
				}
			},
			popup: {
				files: {
					'src/popup/css/popup.css': 'src/popup/css/popup.scss'
				}
			}
		},

		bower_concat: {
			all: {
				dest: 'src/popup/bower.js',
				cssDest: 'src/popup/css/bower.css',
				exclude: ['jquery'],
				mainFiles: {
					linkifyjs: ['linkify.js', 'linkify-string.js']
				}
			},
			jquery: {
				dest: 'src/inc/jquery.js',
				include: ['jquery']
			}
		},

		copy: {
			all: {
				files: [
					{expand: true, cwd: 'src/', src: ['**'], dest: '.build/'},
				],
			},
		},

		clean: {
			build: [".build/popup/css/mixins", ".build/**/*.scss", ".build/**/*.map"],
			after: [".build"]
		},

		uglify: {
			jquery: {
				files: {
					'.build/inc/jquery.js': ['.build/inc/jquery.js']
				}
			},
			bower: {
				files: {
					'.build/popup/bower.js': ['.build/popup/bower.js'],
				}
			}
		},

		zip: {
			dist: {
				cwd: '.build/',
				src: '.build/**',
				dest: 'Архив/' + '<%= manifest.version %>' + '.zip',
				compression: 'DEFLATE'
			}
		},
	});

	// 3. Тут мы указываем Grunt, что хотим использовать этот плагин

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zip');


	// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
	grunt.registerTask('default', ['sass', 'bower_concat', 'copy', 'clean:build', 'uglify', 'zip', 'clean:after']);
	// grunt.registerTask('dev', ['sass', 'copy:dev', 'uglify', 'csso', 'string-replace']);
};