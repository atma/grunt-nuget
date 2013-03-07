"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<= package.json %>',
    lint: {
      files: ['grunt.js', 'tasks/**/*.js']
    },
    watch: {
      gruntfile: {
        files: ['<%= jshint.gruntfile %>'],
        tasks: ['jshint:gruntfile']
      },
      libs_n_tests: {
        files: ['<%= jshint.libs_n_tests %>'],
        tasks: ['jshint:libs_n_tests']
      },
      files: '<%= lint.files %>',
      tasks: ['default']
    },
    jshint: {
      gruntfile: ['Gruntfile.js'],
      libs_n_tests: ['lib/**/*.js', 'tasks/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        node: true,
       es5: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint']);

};
