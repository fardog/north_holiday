'use strict';

module.exports = function (grunt) {
	var modernizr = 'bower_components/modernizr/modernizr.js';
	var jsFiles = [
		'bower_components/jquery/jquery.min.js',
		'bower_components/retina.js/src/retina.js',
		'bower_components/knockout.js/knockout.js',
		'bower_components/foundation/js/foundation/foundation.js',
		'bower_components/js-md5/js/md5.js',
		'assets/js/app.js'
	];

	var cssFiles = [
		'assets/css/app.css'
	];

	grunt.initConfig({
		uglify: {
			dist: {
				files: {
					'assets/js/app.min.js': jsFiles
				}
			},
			deploy: {
				files: {
					'www/assets/js/app.min.js': jsFiles
				}
			},
			dev: {
				options: {
					beautify: {
						width: 80,
						beautify: true
					}
				},
				files: {
					'assets/js/app.min.js': jsFiles
				}
			}
		},
		sass: {
			dist: {
				files: {
					'assets/css/app.css': 'src/app.scss'
				}
			},
			deploy: {
				files: {
					'www/assets/css/app.css': 'src/app.scss'
				}
			}
		},
		jade: {
			dist: {
				options: {
					data: {
						modernizr: modernizr,
						js: ['assets/js/app.min.js'],
						css: ['assets/css/app.css']
					}
				},
				files: {
					'index.html': ['src/index.jade']
				}
			},
			deploy: {
				options: {
					data: {
						modernizr: modernizr,
						js: ['assets/js/app.min.js'],
						css: ['assets/css/app.css']
					}
				},
				files: {
					'www/index.html': ['src/index.jade']
				}
			},
			dev: {
				options: {
					data: {
						modernizr: modernizr,
						js: jsFiles,
						css: ['assets/css/app.css']
					}
				},
				files: {
					'index.html': ['src/index.jade']
				}
			}
		},
		copy: {
			deploy: {
				files: [
					{expand: true, src: ['assets/img/*'], dest: 'www/', filter: 'isFile'}
				]
			}
		},
		initialize: {
			www: ['www/assets/img', 'www/assets/css', 'www/assets/js']
		},
		downloads: {
			north: {
				code_file: 'config/download_codes.json',
				output_directory: 'downloads'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['sass:dist', 'uglify:dist', 'jade:dist']);
	grunt.registerTask('dev', ['sass:dist', 'jade:dev']);
	grunt.registerTask('deploy', [
		'sass:deploy',
		'uglify:deploy',
		'jade:deploy',
		'copy:deploy',
	]);
	grunt.registerMultiTask('initialize', 'Created directory hierarchy', function() {
		console.log('Initializing directories for ' + this.target);
		for (var i = 0; i < this.data.length; i++) {
			grunt.file.mkdir(__dirname + '/' + this.data[i]);
		}
	});
	grunt.registerMultiTask('downloads', 'Generated download codes', function() {
		console.log('Creating download codes for ' + this.target);
		var codeFileData = grunt.file.readJSON(this.data.code_file);

		var crypto = require('crypto');
		for (var i = 0; i < codeFileData.codes.length; i++) {
			var md5sum = crypto.createHash('md5');
			md5sum.update(codeFileData.codes[i]);
			var download = {
				"valid": true,
				"download": codeFileData.download,
				"hash": md5sum.digest('hex')
			}
			grunt.file.write(this.data.output_directory + '/' + download.hash + '.json', JSON.stringify(download));
		}
	});
};
