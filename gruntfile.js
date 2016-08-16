
module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify : {
        build : {
          src: 'js/*.js',
          dest: 'javascript/script.min.js'
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify:build']);

};
