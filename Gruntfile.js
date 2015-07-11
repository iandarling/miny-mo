module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			dist: {
				expand: true,
				src: ['miny-mo.html', 'miny-mo.css', 'miny-mo.js', 'bower_components/d3/d3.min.js'],
				dest: 'dist/',
				flatten: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};